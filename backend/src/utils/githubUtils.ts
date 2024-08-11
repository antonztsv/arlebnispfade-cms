import config from '@/config';
import { Octokit } from '@octokit/rest';
import { isDeepEqual } from 'remeda';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
export const owner = config.githubRepoOwner;
export const repo = config.githubRepoName;

export async function createBranch(branchName: string): Promise<void> {
  try {
    const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError('Main branch not found');
    }
    throw error;
  }
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  sha?: string,
): Promise<void> {
  if (!path || !content || !message || !branch) {
    throw new ValidationError('Missing required parameters for creating or updating file');
  }

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(sha && { sha }),
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      if (error.status === 404) {
        throw new NotFoundError(`File or branch not found: ${path}`);
      }
      if (error.status === 422) {
        throw new ValidationError('Invalid file content or branch name');
      }
    }
    throw error;
  }
}

export function generatePRTitle(action: string, itemType: string, itemId: string): string {
  return `[CMS] ${action} ${itemType} ${itemId}`;
}

export function generatePRDescription(action: string, itemType: string, itemTitle: string): string {
  return `This pull request ${action.toLowerCase()}s the ${itemType.toLowerCase()}: ${itemTitle}\n\nCreated by CMS`;
}

export function detectChanges<T extends object>(existingData: T, newData: Partial<T>): boolean {
  return Object.keys(newData).some((key) => {
    return !isDeepEqual(newData[key as keyof T], (existingData as any)[key]);
  });
}

export { octokit };
