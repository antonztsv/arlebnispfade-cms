import config from '@/config';
import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import { POI } from '@/types/contentTypes';

const octokit = new Octokit({
  auth: config.githubPersonalAccessToken,
});

if (!config.githubRepoName || !config.githubRepoOwner) {
  throw new Error('Missing GitHub repository configuration');
}
const owner = config.githubRepoOwner;
const repo = config.githubRepoName;

export async function getPOIsForRoute(routeId: string): Promise<POI[]> {
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
      throw new Error('POI not found');
    }
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new Error('POI not found');
    }
    throw error; // Re-throw other errors
  }
}

export async function createPOI(routeId: string, poiData: Omit<POI, 'id'>): Promise<POI> {
  const poiId = generatePoiId(poiData.title);
  const path = `src/${routeId}/${poiId}.md`;
  const content = matter.stringify(poiData.content || '', poiData);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `${config.commitPrefix} Create new POI: ${poiData.title}`,
    content: Buffer.from(content).toString('base64'),
  });

  return { ...poiData, id: poiId } as POI;
}

export async function updatePOI(
  routeId: string,
  poiId: string,
  poiData: Partial<POI>,
): Promise<POI> {
  const path = `src/${routeId}/${poiId}.md`;
  const { data: existingFile } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if ('content' in existingFile) {
    const existingContent = Buffer.from(existingFile.content, 'base64').toString('utf8');
    const { data: existingFrontmatter, content: existingMarkdownContent } = matter(existingContent);

    const updatedFrontmatter = { ...existingFrontmatter, ...poiData };
    const updatedContent = matter.stringify(
      poiData.content || existingMarkdownContent,
      updatedFrontmatter,
    );

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `${config.commitPrefix} Update POI: ${poiId}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: existingFile.sha,
    });

    return {
      id: poiId,
      ...updatedFrontmatter,
      content: poiData.content || existingMarkdownContent,
    } as POI;
  }
  throw new Error('POI not found');
}

export async function deletePOI(routeId: string, poiId: string): Promise<void> {
  const path = `src/${routeId}/${poiId}.md`;
  const { data: file } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if ('sha' in file) {
    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: `${config.commitPrefix} Delete POI: ${poiId}`,
      sha: file.sha,
    });
  } else {
    throw new Error('POI not found');
  }
}

function generatePoiId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
