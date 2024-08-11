import config from '@/config';
import { routeSchema, Route } from '@/schemas/routeSchema';
import matter from 'gray-matter';
import * as pullRequestService from './pullRequestService';
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

export async function getAllRoutes(): Promise<Route[]> {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'src',
    });

    if (!Array.isArray(contents)) {
      throw new Error('Unexpected response structure');
    }

    const routes: Route[] = await Promise.all(
      contents
        .filter((item) => item.type === 'dir' && config.currentRoutes.includes(item.name))
        .map(async (item) => {
          const routeMetadata = await getRouteMetadata(item.name);
          return {
            title: routeMetadata.title || item.name,
            layout: routeMetadata.layout || '',
            image: routeMetadata.image || '',
            type: routeMetadata.type || '',
          };
        }),
    );

    return routes;
  } catch (error) {
    console.error('Error fetching all routes:', error);
    throw error;
  }
}

export async function getRouteById(routeId: string): Promise<Route> {
  try {
    const routeMetadata = await getRouteMetadata(routeId);

    if (!routeMetadata.title) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }

    return {
      title: routeMetadata.title,
      layout: routeMetadata.layout || '',
      image: routeMetadata.image || '',
      type: routeMetadata.type || '',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
}

export async function updateRoute(routeId: string, routeData: Partial<Route>): Promise<Route> {
  const path = `src/${routeId}/index.md`;

  try {
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(file) || file.type !== 'file') {
      throw new Error('Unexpected response structure');
    }

    const content = Buffer.from(file.content, 'base64').toString('utf8');
    const { data: existingFrontmatter, content: existingMarkdownContent } = matter(content);

    const updatedRoute = {
      title: routeData.title || existingFrontmatter.title,
      layout: routeData.layout || existingFrontmatter.layout,
      image: routeData.image || existingFrontmatter.image,
      type: routeData.type || existingFrontmatter.type,
    };

    // Check for changes
    const hasChanges = detectChanges(existingFrontmatter, updatedRoute);

    if (!hasChanges) {
      throw new ConflictError('No changes detected. Skipping update.');
    }

    const validation = validateRoute(updatedRoute);
    if (!validation.isValid) {
      throw new ValidationError(`Invalid route data: ${validation.errors.join(', ')}`);
    }

    const updatedContent = matter.stringify(existingMarkdownContent, updatedRoute);

    const branchName = `update-route-${routeId}-${Date.now()}`;
    await createBranch(branchName);

    await createOrUpdateFile(
      path,
      updatedContent,
      `${config.commitPrefix} Update route ${routeId}`,
      branchName,
      file.sha,
    );

    const prTitle = generatePRTitle('Update', 'Route', routeId);
    const prDescription = generatePRDescription('Update', 'Route', updatedRoute.title || routeId);
    await pullRequestService.createPullRequest('main', branchName, prTitle, prDescription);

    return updatedRoute;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ValidationError ||
      error instanceof ConflictError
    ) {
      throw error;
    }
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }
    console.error(`Error updating route ${routeId}:`, error);
    throw error;
  }
}

async function getRouteMetadata(routeId: string): Promise<{
  title?: string;
  layout?: string;
  image?: string;
  type?: string;
}> {
  try {
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path: `src/${routeId}/index.md`,
    });

    if (Array.isArray(file) || file.type !== 'file') {
      throw new Error('Unexpected response structure');
    }

    const content = Buffer.from(file.content, 'base64').toString('utf8');
    const { data: frontmatter } = matter(content);

    return {
      title: frontmatter.title,
      layout: frontmatter.layout,
      image: frontmatter.image,
      type: frontmatter.type,
    };
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new NotFoundError(`Route not found: ${routeId}`);
    }
    console.error(`Error fetching route metadata for ${routeId}:`, error);
    throw error;
  }
}

function validateRoute(route: Partial<Route>): { isValid: boolean; errors: string[] } {
  const result = routeSchema.safeParse(route);
  if (result.success) {
    return { isValid: true, errors: [] };
  } else {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }
}
