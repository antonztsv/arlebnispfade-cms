import config from '@/config';
import { Octokit } from '@octokit/rest';
import { routeSchema, Route } from '@/schemas/routeSchema';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
const owner = config.githubRepoOwner;
const repo = config.githubRepoName;

export async function getAllRoutes(): Promise<Route[]> {
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
          id: item.name,
          title: routeMetadata.title || item.name,
          layout: routeMetadata.layout || '',
          image: routeMetadata.image || '',
          type: routeMetadata.type || '',
        };
      }),
  );

  return routes;
}

export async function getRouteById(routeId: string): Promise<Route> {
  const routeMetadata = await getRouteMetadata(routeId);

  if (!routeMetadata.title) {
    throw new Error(`Route not found: ${routeId}`);
  }

  return {
    id: routeId,
    title: routeMetadata.title,
    layout: routeMetadata.layout || '',
    image: routeMetadata.image || '',
    type: routeMetadata.type || '',
  };
}

export async function updateRoute(routeId: string, routeData: Partial<Route>): Promise<Route> {
  const path = `src/${routeId}/index.md`;

  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path });

    if (Array.isArray(file) || file.type !== 'file') {
      throw new Error('Unexpected response structure');
    }

    const content = Buffer.from(file.content, 'base64').toString('utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    const updatedRoute = {
      id: routeId,
      title: routeData.title || frontmatter.title,
      layout: routeData.layout || frontmatter.layout,
      image: routeData.image || frontmatter.image,
      type: routeData.type || frontmatter.type,
    };

    const validation = validateRoute(updatedRoute);
    if (!validation.isValid) {
      throw new Error(`Invalid route data: ${validation.errors.join(', ')}`);
    }

    const updatedContent = matter.stringify(markdownContent, updatedRoute);

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `${config.commitPrefix} Update route ${routeId}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: file.sha,
    });

    return updatedRoute;
  } catch (error) {
    if (error instanceof Error) {
      if ('status' in error && error.status === 404) {
        throw new Error(`Route not found: ${routeId}`);
      }
      throw error; // Re-throw other errors
    }
    throw new Error('An unknown error occurred');
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
    if (error instanceof Error) {
      if ('status' in error && error.status === 404) {
        throw new Error(`Route not found: ${routeId}`);
      }
      throw error; // Re-throw other errors
    }
    throw new Error('An unknown error occurred');
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
