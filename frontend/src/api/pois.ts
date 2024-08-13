import { API_BASE_URL, authenticatedFetch } from './config';

export type POI = {
  id: string;
  title: string;
  image: string;
  layout: string;
  gmaps: string | null;
  coords: [number, number];
  info: string;
  arDesc: string;
  content?: string;
};

export async function fetchPOIsForRoute(routeId: string): Promise<POI[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/pois`);
  if (!response.ok) {
    throw new Error('Failed to fetch POIs');
  }
  return response.json();
}

export async function fetchPOIById(routeId: string, poiId: string): Promise<POI> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/pois/${poiId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch POI');
  }
  return response.json();
}
