import { API_BASE_URL, authenticatedFetch } from './config';

export interface PullRequest {
  id: string;
  title: string;
  description: string;
}

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/pull-requests`);
  if (!response.ok) {
    throw new Error('Failed to fetch pull requests');
  }
  return response.json();
}
