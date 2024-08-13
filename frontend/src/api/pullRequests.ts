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
};

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/pull-requests`);
  if (!response.ok) {
    throw new Error('Failed to fetch pull requests');
  }
  return response.json();
}
