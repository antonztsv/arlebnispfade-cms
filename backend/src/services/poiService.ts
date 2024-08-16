import config from '@/config';
import matter from 'gray-matter';
import { poiSchema, POI } from '@/schemas/poiSchema';
import * as pullRequestService from '@/services/pullRequestService';
import {
  createBranch,
  createOrUpdateFile,
  generatePRTitle,
  generatePRDescription,
  detectChanges,
  octokit,
  owner,
  repo,
} from '@/utils/githubUtils';
import { NotFoundError, ValidationError, ConflictError } from '@/utils/errorHandler';

export async function getPOIsForRoute(routeId: string): Promise<POI[]> {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: `src/${routeId}`,
    });

    if (!Array.isArray(contents)) {
      throw new Error('Unexpected response structure');
    }

    const poiFiles = contents.filter(
      (item) => item.type === 'file' && item.name.endsWith('.md') && item.name !== 'index.md',
    );

    const pois = await Promise.all(
      poiFiles.map(async (file) => {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if ('content' in data) {
          const content = Buffer.from(data.content, 'base64').toString('utf8');
          const { data: frontmatter, content: markdownContent } = matter(content);

          return {
            id: file.name.replace('.md', ''),
            ...frontmatter,
            content: markdownContent,
          } as POI;
        }
      }),
    );

    return pois.filter((poi): poi is POI => poi !== undefined);
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }
    throw error;
  }
}

export async function getPOIById(routeId: string, poiId: string): Promise<POI> {
  const path = `src/${routeId}/${poiId}.md`;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      return { id: poiId, ...frontmatter, content: markdownContent } as POI;
    } else {
      throw new NotFoundError(`POI not found: ${poiId}`);
    }
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`POI not found: ${poiId}`);
    }
    throw error;
  }
}

export async function createPOI(routeId: string, poiData: Omit<POI, 'id'>): Promise<POI> {
  const validation = validatePOI(poiData);
  if (!validation.isValid) {
    throw new ValidationError(`Invalid POI data: ${validation.errors.join(', ')}`);
  }

  const poiId = generatePoiId(poiData.title);
  const path = `src/${routeId}/${poiId}.md`;
  const content = matter.stringify(poiData.content || '', poiData);

  const branchName = await createBranch(`create-poi-${poiId}-${Date.now()}`);

  await createOrUpdateFile(
    path,
    content,
    `${config.commitPrefix} Create new POI ${poiId}`,
    branchName,
  );

  const prTitle = generatePRTitle('Create', 'POI', poiId);
  const prDescription = generatePRDescription('Create', 'POI', poiData.title);
  await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

  return { ...poiData, id: poiId } as POI;
}

export async function updatePOI(
  routeId: string,
  poiId: string,
  poiData: Partial<POI>,
): Promise<POI> {
  const path = `src/${routeId}/${poiId}.md`;

  try {
    const { data: existingFile } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in existingFile) {
      const existingContent = Buffer.from(existingFile.content, 'base64').toString('utf8');
      const { data: existingFrontmatter, content: existingMarkdownContent } =
        matter(existingContent);

      const updatedPOI = {
        ...existingFrontmatter,
        ...poiData,
        id: poiId,
      };

      // Check for changes
      const frontmatterChanges = detectChanges(existingFrontmatter, updatedPOI);
      const contentChanged = poiData.content && poiData.content !== existingMarkdownContent;

      // No changes detected
      if (!frontmatterChanges && !contentChanged) {
        throw new ConflictError('No changes detected. Skipping update.');
      }

      const validationResult = poiSchema.safeParse(updatedPOI);
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        );
        throw new ValidationError(`Invalid POI data: ${errorMessages.join(', ')}`);
      }

      const updatedContent = matter.stringify(
        poiData.content || existingMarkdownContent,
        validationResult.data,
      );

      const branchName = await createBranch(`update-poi-${poiId}-${Date.now()}`);

      await createOrUpdateFile(
        path,
        updatedContent,
        `${config.commitPrefix} Update POI ${poiId}`,
        branchName,
        existingFile.sha,
      );

      const prTitle = generatePRTitle('Update', 'POI', poiId);
      const prDescription = generatePRDescription('Update', 'POI', updatedPOI.title || poiId);
      await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

      return {
        ...validationResult.data,
        content: poiData.content || existingMarkdownContent,
      };
    } else {
      throw new Error('Unexpected response structure from GitHub API');
    }
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`POI not found: ${poiId}`);
    }
    throw error;
  }
}

export async function deletePOI(routeId: string, poiId: string): Promise<void> {
  const path = `src/${routeId}/${poiId}.md`;
  try {
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('sha' in file) {
      const branchName = await createBranch(`delete-poi-${poiId}-${Date.now()}`);

      await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message: `${config.commitPrefix} Delete POI ${poiId}`,
        sha: file.sha,
        branch: branchName,
      });

      const prTitle = generatePRTitle('Delete', 'POI', poiId);
      const prDescription = generatePRDescription('Delete', 'POI', poiId);
      await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);
    } else {
      throw new NotFoundError(`POI not found: ${poiId}`);
    }
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`POI not found: ${poiId}`);
    }
    throw error;
  }
}

function generatePoiId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function validatePOI(poi: Partial<POI>): { isValid: boolean; errors: string[] } {
  const result = poiSchema.safeParse(poi);
  if (result.success) {
    return { isValid: true, errors: [] };
  } else {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }
}
