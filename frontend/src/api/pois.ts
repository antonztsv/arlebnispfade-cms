import { API_BASE_URL, authenticatedFetch } from './config';

type ArNft = {
  type: string;
  id: string;
  name: string;
  model?: string;
  position: string;
  rotation: string;
  scale: string;
};

type ArVideo = {
  type: string;
  url: string;
};

type ArAudio = {
  filename: string;
};

type ArModel = {
  type: string;
  url: string;
};

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
  type: string;
  ar: {
    type: string;
    content: string;
    location: string;
    audio?: ArAudio[];
    video?: ArVideo[];
    model?: ArModel[];
    nft: ArNft[];
  };
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

export async function updatePOI(routeId: string, poiId: string, poi: Partial<POI>): Promise<POI> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/pois/${poiId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poi),
  });
  if (!response.ok) {
    throw new Error('Failed to update POI');
  }
  return response.json();
}

export async function createPOI(routeId: string, poiData: Omit<POI, 'id'>): Promise<POI> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/pois`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poiData),
  });
  if (!response.ok) {
    throw new Error('Failed to create POI');
  }
  return response.json();
}

export async function deletePOI(routeId: string, poiId: string): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/pois/${poiId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete POI');
  }
}
