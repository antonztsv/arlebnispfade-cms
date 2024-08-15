import { API_BASE_URL, authenticatedFetch } from './config';

export type PullRequest = {
  id: number;
  number: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  files: [
    {
      filename: string;
      status: string;
      additions: number;
      deletions: number;
      changes: number;
    },
  ];
};

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/pull-requests`);
  if (!response.ok) {
    throw new Error('Failed to fetch pull requests');
  }
  return response.json();
}

export async function mergePullRequest(pullRequestNumber: number): Promise<void> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/pull-requests/${pullRequestNumber}/merge`,
    {
      method: 'PUT',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to merge pull request');
  }
}

export async function closePullRequest(pullRequestNumber: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/pull-requests/${pullRequestNumber}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to close pull request');
  }
}
