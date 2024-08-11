import config from '@/config';
import { Octokit } from '@octokit/rest';
import { PullRequest } from '@/types/pullRequests';
import { NotFoundError, ForbiddenError, ValidationError } from '@/utils/errorHandler';

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
const owner = config.githubRepoOwner;
const repo = config.githubRepoName;

export async function getAllPullRequests(): Promise<PullRequest[]> {
  try {
    const { data: allPullRequests } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
    });

    return Promise.all(
      allPullRequests.filter((pr) => isCMSPullRequest(pr.title)).map(simplifyPullRequest),
    );
  } catch (error) {
    console.error('Error listing pull requests:', error);
    throw error;
  }
}

export async function getPullRequest(pullNumber: number): Promise<PullRequest> {
  try {
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (!isCMSPullRequest(pullRequest.title)) {
      throw new ForbiddenError('This is not a CMS-created pull request');
    }

    return await simplifyPullRequest(pullRequest);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Pull request #${pullNumber} not found`);
    }
    console.error('Error getting pull request:', error);
    throw error;
  }
}

export async function createPullRequest(
  baseBranch: string,
  headBranch: string,
  title: string,
  body: string,
): Promise<PullRequest> {
  try {
    if (!baseBranch || !headBranch || !title) {
      throw new ValidationError('Missing required parameters for creating a pull request');
    }

    const { data: pullRequest } = await octokit.pulls.create({
      owner,
      repo,
      title,
      head: headBranch,
      base: baseBranch,
      body,
    });

    return await simplifyPullRequest(pullRequest);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError('The specified repository or branches were not found.');
    }
    console.error('Error creating pull request:', error);
    throw error;
  }
}

export async function mergePullRequest(
  pullNumber: number,
): Promise<{ merged: boolean; message: string }> {
  try {
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (!isCMSPullRequest(pullRequest.title)) {
      throw new ForbiddenError('This is not a CMS-created pull request');
    }

    const { data: mergeResult } = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return { merged: mergeResult.merged, message: mergeResult.message };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Pull request #${pullNumber} not found`);
    }
    console.error('Error merging pull request:', error);
    throw error;
  }
}

export async function deletePullRequest(pullNumber: number): Promise<{ message: string }> {
  try {
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (!isCMSPullRequest(pullRequest.title)) {
      throw new ForbiddenError('This is not a CMS-created pull request');
    }

    await octokit.git.deleteRef({
      owner,
      repo,
      ref: `heads/${pullRequest.head.ref}`,
    });

    return { message: `Pull request #${pullNumber} and its associated branch have been deleted.` };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Pull request #${pullNumber} not found`);
    }
    console.error('Error deleting pull request:', error);
    throw error;
  }
}

function isCMSPullRequest(title: string): boolean {
  return title.startsWith('[CMS]');
}

async function simplifyPullRequest(pr: any): Promise<PullRequest> {
  // Holen Sie die Dateien für den Pull Request
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pr.number,
  });

  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    state: pr.state,
    created_at: pr.created_at,
    updated_at: pr.updated_at,
    html_url: pr.html_url,
    user: pr.user
      ? {
          login: pr.user.login,
          avatar_url: pr.user.avatar_url,
        }
      : null,
    head: {
      ref: pr.head.ref,
      sha: pr.head.sha,
    },
    base: {
      ref: pr.base.ref,
    },
    files: files.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
    })),
  };
}
