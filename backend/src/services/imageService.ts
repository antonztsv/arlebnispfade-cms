import config from '@/config';
import crypto from 'crypto';
import path from 'path';
import { Image, imageSchema } from '@/schemas/imageSchema';
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

export async function createImage(
  routeId: string,
  file: Express.Multer.File,
  isSmallImage: boolean,
): Promise<Image> {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  const filename = file.originalname;
  const filePath = isSmallImage
    ? `src/${routeId}/images/small/${filename}`
    : `src/${routeId}/images/${filename}`;

  const branchName = await createBranch(`create-image-${filename}-${Date.now()}`);

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `${config.commitPrefix} Add new image ${filename}${isSmallImage ? ' (small)' : ''}`,
      content: file.buffer.toString('base64'),
      branch: branchName,
    });

    const prTitle = generatePRTitle('Create', 'Image', filename);
    const prDescription = generatePRDescription('Create', 'Image', filename);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

    const newImage: Image = {
      id: generateConsistentId(filePath),
      filename,
      url: filePath,
    };

    return imageSchema.parse(newImage);
  } catch (error) {
    console.error('Error creating image:', error);
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Unable to create image: ${error.message}`);
    }
    throw error;
  }
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

// src/services/imageService.ts

export async function deleteImage(routeId: string, imageId: string): Promise<void> {
  const basePath = `src/${routeId}/images`;
  const smallPath = `${basePath}/small`;

  try {
    // look for the image in the main directory
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path: basePath,
    });

    let imageToDelete = Array.isArray(file)
      ? file.find((item) => item.name === imageId || generateConsistentId(item.path) === imageId)
      : null;

    // if not found, look for the image in the small directory
    if (!imageToDelete) {
      const { data: smallFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: smallPath,
      });

      imageToDelete = Array.isArray(smallFile)
        ? smallFile.find(
            (item) => item.name === imageId || generateConsistentId(item.path) === imageId,
          )
        : null;
    }

    if (!imageToDelete || !('sha' in imageToDelete)) {
      throw new NotFoundError(`Image not found: ${imageId}`);
    }

    const branchName = await createBranch(`delete-image-${imageToDelete.name}-${Date.now()}`);

    await octokit.repos.deleteFile({
      owner,
      repo,
      path: imageToDelete.path,
      message: `${config.commitPrefix} Delete image ${imageToDelete.name}`,
      sha: imageToDelete.sha,
      branch: branchName,
    });

    const prTitle = generatePRTitle('Delete', 'Image', imageToDelete.name);
    const prDescription = generatePRDescription('Delete', 'Image', imageToDelete.name);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Image not found: ${imageId}`);
    }
    throw error;
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
