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

export async function fetchRoute(routeId: string): Promise<Route> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch route');
  }
  return response.json();
}

export async function updateRoute(route: Route): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${route.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(route),
  });
  if (!response.ok) {
    throw new Error('Failed to update route');
  }
}
