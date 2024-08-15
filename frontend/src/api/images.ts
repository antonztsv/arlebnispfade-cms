import { API_BASE_URL, authenticatedFetch } from './config';

export type Image = {
  id: string;
  filename: string;
  url: string;
};

export async function fetchImages(routeId: string): Promise<Image[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/images`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return response.json();
}

export async function addImage(routeId: string, file: File): Promise<Image> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add image');
  }

  return response.json();
}

export async function deleteImage(routeId: string, imageId: string): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/routes/${routeId}/images/${imageId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
}
