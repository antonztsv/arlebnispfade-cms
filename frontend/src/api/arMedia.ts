import { API_BASE_URL, authenticatedFetch } from './config';

export type ARMedia = {
  id: string;
  type: 'audio' | 'image' | 'video' | 'model';
  filename: string;
  url: string;
};

export async function fetchARMedia(routeId: string): Promise<ARMedia[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/ar-media`);
  if (!response.ok) {
    throw new Error('Failed to fetch AR media');
  }
  return response.json();
}

export async function addARMedia(routeId: string, file: File): Promise<ARMedia> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/ar-media`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add AR media');
  }

  return response.json();
}

export async function deleteARMedia(routeId: string, arMediaId: string): Promise<void> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/routes/${routeId}/ar-media/${arMediaId}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete AR media');
  }
}
