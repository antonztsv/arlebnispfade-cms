import { API_BASE_URL, authenticatedFetch } from './config';

export type Route = {
  id: string;
  title: string;
  layout: string;
  image: string;
  type: string;
};

export async function fetchRoutes(): Promise<Route[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes`);
  if (!response.ok) {
    throw new Error('Failed to fetch routes');
  }
  return response.json();
}
