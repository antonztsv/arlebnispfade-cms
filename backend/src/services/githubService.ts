import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

if (!process.env.GITHUB_REPO_OWNER || !process.env.GITHUB_REPO_NAME) {
  throw new Error('GITHUB_REPO_OWNER and GITHUB_REPO_NAME must be set in .env');
}
const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;

export async function getFileContent(path: string): Promise<string> {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(response.data) || !('content' in response.data)) {
      throw new Error('Unexpected response structure');
    }

    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

export async function updateFileContent(path: string, content: string, sha: string): Promise<void> {
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update ${path}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
  } catch (error) {
    console.error('Error updating file content:', error);
    throw error;
  }
}
