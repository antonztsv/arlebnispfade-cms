import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

if (!process.env.GITHUB_REPO_OWNER || !process.env.GITHUB_REPO_NAME) {
  throw new Error('Missing GitHub repository configuration');
}
const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;

interface Route {
  id: string;
  name: string;
  description: string;
  pois: string[];
}

export async function getAllRoutes(): Promise<Route[]> {
  const { data: contents } = await octokit.repos.getContent({
    owner,
    repo,
    path: 'src',
  });

  if (!Array.isArray(contents)) {
    throw new Error('Unexpected response structure');
  }

  const routes: Route[] = contents
    .filter(
      (item) =>
        item.type === 'dir' && ['wiehl', 'wipperfuerth', 'strasse-der-arbeit'].includes(item.name),
    )
    .map((item) => ({
      id: item.name,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      description: '', // We'll need to fetch this from a metadata file or generate it
      pois: [], // We'll populate this later
    }));

  return routes;
}

export async function getRouteById(routeId: string): Promise<Route> {
  const { data: contents } = await octokit.repos.getContent({
    owner,
    repo,
    path: `src/${routeId}`,
  });

  if (!Array.isArray(contents)) {
    throw new Error('Unexpected response structure');
  }

  const pois = contents
    .filter((item) => item.type === 'file' && item.name.endsWith('.md') && item.name !== 'index.md')
    .map((item) => item.name.replace('.md', ''));

  // TODO: Fetch description from index.md or a metadata file

  return {
    id: routeId,
    name: routeId.charAt(0).toUpperCase() + routeId.slice(1),
    description: '', // We'll need to implement this
    pois,
  };
}

export async function updateRoute(routeId: string, routeData: Partial<Route>): Promise<void> {
  // TODO: Implement updating route metadata
  // This might involve updating an index.md file or a separate metadata file
  throw new Error('Not implemented');
}
