import config from '@/config';
import { Readable } from 'stream';
import crypto from 'crypto';
import { ARMedia, arMediaSchema } from '@/schemas/arMediaSchema';
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

export async function getARMediaForRoute(routeId: string): Promise<ARMedia[]> {
  const basePath = `src/${routeId}/ar-media`;
  try {
    const arMedia = await getARMediaRecursive(basePath, basePath);

    if (arMedia.length === 0) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }

    return arMedia;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error('An error occurred while fetching AR media');
  }
}

export async function getARMediaById(routeId: string, mediaId: string): Promise<ARMedia> {
  const basePath = `src/${routeId}/ar-media`;
  const allMedia = await getARMediaRecursive(basePath, basePath);

  const media = allMedia.find((item) => item.id === mediaId);

  if (!media) {
    throw new NotFoundError(`AR Media not found: ${mediaId}`);
  }

  return media;
}

export async function createARMedia(
  routeId: string,
  file: Express.Multer.File,
  mediaType: string,
): Promise<ARMedia> {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  if (!['audios', 'images', 'videos', 'models'].includes(mediaType)) {
    throw new ValidationError('Invalid media type');
  }

  const filename = file.originalname;
  const filePath = `src/${routeId}/ar-media/${mediaType}/${filename}`;

  // Konvertiere den Buffer in einen lesbaren Stream
  const contentStream = new Readable();
  contentStream.push(file.buffer);
  contentStream.push(null);

  const branchName = await createBranch(`create-ar-media-${filename}-${Date.now()}`);

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `${config.commitPrefix} Add new AR media ${filename}`,
      content: file.buffer.toString('base64'),
      branch: branchName,
    });

    const prTitle = generatePRTitle('Create', 'AR Media', filename);
    const prDescription = generatePRDescription('Create', 'AR Media', filename);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

    const type = mediaType.slice(0, -1) as 'audio' | 'image' | 'video' | 'model';

    const newMedia: ARMedia = {
      id: generateConsistentId(filePath),
      type,
      filename,
      url: filePath,
    };

    return arMediaSchema.parse(newMedia);
  } catch (error) {
    console.error('Error creating AR media:', error);
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Unable to create AR media: ${error.message}`);
    }
    throw error;
  }
}

export async function updateARMedia(
  routeId: string,
  mediaId: string,
  file: Express.Multer.File,
): Promise<ARMedia> {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  const basePath = `src/${routeId}/ar-media`;
  const allMedia = await getARMediaRecursive(basePath, basePath);
  const existingMedia = allMedia.find((item) => item.id === mediaId);

  if (!existingMedia) {
    throw new NotFoundError(`AR Media not found: ${mediaId}`);
  }

  const path = `src/${routeId}/ar-media/${existingMedia.filename}`;
  const content = file.buffer.toString('base64');

  const branchName = await createBranch(`update-ar-media-${existingMedia.filename}-${Date.now()}`);

  await createOrUpdateFile(
    path,
    content,
    `${config.commitPrefix} Update AR media ${existingMedia.filename}`,
    branchName,
  );

  const prTitle = generatePRTitle('Update', 'AR Media', existingMedia.filename);
  const prDescription = generatePRDescription('Update', 'AR Media', existingMedia.filename);
  await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

  return {
    id: mediaId,
    type: getMediaType(existingMedia.filename),
    filename: existingMedia.filename,
    url: existingMedia.url,
  };
}

export async function deleteARMedia(routeId: string, mediaId: string): Promise<void> {
  const basePath = `src/${routeId}/ar-media`;
  const allMedia = await getARMediaRecursive(basePath, basePath);
  const mediaToDelete = allMedia.find((item) => item.id === mediaId);

  if (!mediaToDelete) {
    throw new NotFoundError(`AR Media not found: ${mediaId}`);
  }

  const path = `src/${routeId}/ar-media/${mediaToDelete.type}s/${mediaToDelete.filename}`;
  const { data: file } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if ('sha' in file) {
    const branchName = await createBranch(
      `delete-ar-media-${mediaToDelete.filename}-${Date.now()}`,
    );

    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: `${config.commitPrefix} Delete AR media ${mediaToDelete.filename}`,
      sha: file.sha,
      branch: branchName,
    });

    const prTitle = generatePRTitle('Delete', 'AR Media', mediaToDelete.filename);
    const prDescription = generatePRDescription('Delete', 'AR Media', mediaToDelete.filename);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);
  } else {
    throw new NotFoundError(`AR Media file not found: ${mediaToDelete.filename}`);
  }
}

function getMediaType(filename: string): ARMedia['type'] {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp3':
      return 'audio';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'fset':
    case 'fset3':
    case 'iset':
      return 'image';
    case 'mp4':
    case 'webm':
      return 'video';
    case 'glb':
    case 'gltf':
    case 'obj':
    case 'mtl':
      return 'model';
    default:
      throw new Error(`Unrecognized file type for file: ${filename}`);
  }
}

function generateConsistentId(path: string): string {
  return crypto.createHash('md5').update(path).digest('hex');
}

async function getARMediaRecursive(basePath: string, currentPath: string): Promise<ARMedia[]> {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: currentPath,
    });

    if (!Array.isArray(contents)) {
      throw new Error('Unexpected response structure');
    }

    let arMediaItems: ARMedia[] = [];

    for (const item of contents) {
      if (item.type === 'file' && item.name !== '.gitkeep') {
        arMediaItems.push({
          id: generateConsistentId(item.path),
          type: getMediaType(item.name),
          filename: item.name,
          url: item.path,
        });
      } else if (item.type === 'dir') {
        const subItems = await getARMediaRecursive(basePath, item.path);
        arMediaItems = arMediaItems.concat(subItems);
      }
    }

    return arMediaItems;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      console.warn(`Directory not found: ${currentPath}`);
      return [];
    }
    throw error;
  }
}
