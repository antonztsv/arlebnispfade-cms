import { Request, Response } from 'express';
import * as githubService from '@/services/contentService';

export async function getContent(req: Request, res: Response) {
  try {
    const { path } = req.params;
    const content = await githubService.getFileContent(path);
    res.json({ content });
  } catch (error: any) {
    console.error('Error in getContent:', error);
    if (error.status === 404) {
      res.status(404).json({ error: 'File not found' });
    } else if (error.status === 403) {
      res.status(403).json({ error: 'Access denied' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function updateContent(req: Request, res: Response) {
  try {
    const { path } = req.params;
    const { content, sha } = req.body;
    if (!content || !sha) {
      return res.status(400).json({ error: 'Content and SHA are required' });
    }
    await githubService.updateFileContent(path, content, sha);
    res.json({ message: 'Content updated successfully' });
  } catch (error: any) {
    console.error('Error in updateContent:', error);
    if (error.status === 404) {
      res.status(404).json({ error: 'File not found' });
    } else if (error.status === 409) {
      res.status(409).json({ error: 'SHA mismatch. File has been modified' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
