import config from '@/config';
import crypto from 'crypto';
import { Image } from '@/schemas/imageSchema';
import * as pullRequestService from '@/services/pullRequestService';
import {
  createBranch,
  createOrUpdateFile,
  generatePRTitle,
  generatePRDescription,
  octokit,
  owner,
  repo,
} from '@/utils/githubUtils';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

export async function getImagesForRoute(routeId: string): Promise<Image[]> {
  const basePath = `src/${routeId}/images`;
  try {
    const images = await getImagesRecursive(basePath, basePath);

    if (images.length === 0) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }

    return images;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error('An error occurred while fetching images');
  }
}

export async function getImageById(routeId: string, imageId: string): Promise<Image> {
  const basePath = `src/${routeId}/images`;
  const allImages = await getImagesRecursive(basePath, basePath);

  const image = allImages.find((item) => item.id === imageId);

  if (!image) {
    throw new NotFoundError(`Image not found: ${imageId}`);
  }

  return image;
}

export async function createImage(routeId: string, file: Express.Multer.File): Promise<Image> {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  const filename = file.originalname;
  const path = `src/${routeId}/images/${filename}`;
  const content = file.buffer.toString('base64');

  const branchName = await createBranch(`create-image-${filename}-${Date.now()}`);

  await createOrUpdateFile(
    path,
    content,
    `${config.commitPrefix} Add new image ${filename}`,
    branchName,
  );

  const prTitle = generatePRTitle('Create', 'Image', filename);
  const prDescription = generatePRDescription('Create', 'Image', filename);
  await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

  return {
    id: generateConsistentId(path),
    filename,
    url: path,
  };
}

export async function updateImage(
  routeId: string,
  imageId: string,
  file: Express.Multer.File,
): Promise<Image> {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  const basePath = `src/${routeId}/images`;
  const allImages = await getImagesRecursive(basePath, basePath);
  const existingImage = allImages.find((item) => item.id === imageId);

  if (!existingImage) {
    throw new NotFoundError(`Image not found: ${imageId}`);
  }

  const path = `src/${routeId}/images/${existingImage.filename}`;
  const content = file.buffer.toString('base64');

  const branchName = await createBranch(`update-image-${existingImage.filename}-${Date.now()}`);

  await createOrUpdateFile(
    path,
    content,
    `${config.commitPrefix} Update image ${existingImage.filename}`,
    branchName,
  );

  const prTitle = generatePRTitle('Update', 'Image', existingImage.filename);
  const prDescription = generatePRDescription('Update', 'Image', existingImage.filename);
  await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

  return {
    id: imageId,
    filename: existingImage.filename,
    url: existingImage.url,
  };
}

export async function deleteImage(routeId: string, imageId: string): Promise<void> {
  const basePath = `src/${routeId}/images`;
  const allImages = await getImagesRecursive(basePath, basePath);
  const imageToDelete = allImages.find((item) => item.id === imageId);

  if (!imageToDelete) {
    throw new NotFoundError(`Image not found: ${imageId}`);
  }

  const path = `src/${routeId}/images/${imageToDelete.filename}`;
  const { data: file } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if ('sha' in file) {
    const branchName = await createBranch(`delete-image-${imageToDelete.filename}-${Date.now()}`);

    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: `${config.commitPrefix} Delete image ${imageToDelete.filename}`,
      sha: file.sha,
      branch: branchName,
    });

    const prTitle = generatePRTitle('Delete', 'Image', imageToDelete.filename);
    const prDescription = generatePRDescription('Delete', 'Image', imageToDelete.filename);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);
  } else {
    throw new NotFoundError(`Image file not found: ${imageToDelete.filename}`);
  }
}

function generateConsistentId(path: string): string {
  return crypto.createHash('md5').update(path).digest('hex');
}

async function getImagesRecursive(basePath: string, currentPath: string): Promise<Image[]> {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: currentPath,
    });

    if (!Array.isArray(contents)) {
      throw new Error('Unexpected response structure');
    }

    let images: Image[] = [];

    for (const item of contents) {
      if (item.type === 'file' && item.name !== '.gitkeep' && isImageFile(item.name)) {
        images.push({
          id: generateConsistentId(item.path),
          filename: item.name,
          url: item.path,
        });
      } else if (item.type === 'dir') {
        const subItems = await getImagesRecursive(basePath, item.path);
        images = images.concat(subItems);
      }
    }

    return images;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      console.warn(`Directory not found: ${currentPath}`);
      return [];
    }
    throw error;
  }
}

function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}
