import { Octokit } from '@octokit/rest';
import config from '@/config';

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
const owner = config.githubRepoOwner;
const repo = config.githubRepoName;

function isCMSPullRequest(title: string): boolean {
  return title.startsWith('[CMS]');
}

export async function createPullRequest(
  baseBranch: string,
  headBranch: string,
  title: string,
  body: string,
) {
  try {
    const { data: pullRequest } = await octokit.pulls.create({
      owner,
      repo,
      title,
      head: headBranch,
      base: baseBranch,
      body,
    });
    return pullRequest;
  } catch (error) {
    console.error('Error creating pull request:', error);
    throw error;
  }
}

export async function listPullRequests() {
  try {
    const { data: allPullRequests } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
    });

    const cmsPullRequests = allPullRequests.filter((pr) => isCMSPullRequest(pr.title));

    return cmsPullRequests;
  } catch (error) {
    console.error('Error listing pull requests:', error);
    throw error;
  }
}

export async function getPullRequest(pullNumber: number) {
  try {
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (!isCMSPullRequest(pullRequest.title)) {
      throw new Error('This is not a CMS-created pull request');
    }

    // Zusätzliche Details abrufen, die für das Frontend nützlich sein könnten
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      ...pullRequest,
      files: files.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      })),
    };
  } catch (error) {
    console.error('Error getting pull request:', error);
    throw error;
  }
}

export async function mergePullRequest(pullNumber: number) {
  try {
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (!isCMSPullRequest(pullRequest.title)) {
      throw new Error('This is not a CMS-created pull request');
    }

    const { data: mergeResult } = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return mergeResult;
  } catch (error) {
    console.error('Error merging pull request:', error);
    throw error;
  }
}
