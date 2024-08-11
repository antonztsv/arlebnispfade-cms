import config from '@/config';
import { Octokit } from '@octokit/rest';
import { isDeepEqual } from 'remeda';

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
export const owner = config.githubRepoOwner;
export const repo = config.githubRepoName;

export async function createBranch(branchName: string): Promise<void> {
  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: ref.object.sha,
  });
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  sha?: string,
): Promise<void> {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
    ...(sha && { sha }),
  });
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
