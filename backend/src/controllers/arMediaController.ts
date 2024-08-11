import { Request, Response } from 'express';
import * as arMediaService from '@/services/arMediaService';

export async function getARMediaForRoute(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const arMedia = await arMediaService.getARMediaForRoute(routeId);
    res.json(arMedia);
  } catch (error) {
    console.error('Error in getARMediaForRoute:', error);
    if (error instanceof Error && error.message === 'Route not found') {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function getARMediaById(req: Request, res: Response) {
  try {
    const { routeId, mediaId } = req.params;
    const arMedia = await arMediaService.getARMediaById(routeId, mediaId);
    res.json(arMedia);
  } catch (error) {
    console.error('Error in getARMediaById:', error);
    if (error instanceof Error && error.message === 'AR Media not found') {
      res.status(404).json({ error: 'AR Media not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function createARMedia(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const newARMedia = await arMediaService.createARMedia(routeId, file);
    res.status(201).json(newARMedia);
  } catch (error) {
    console.error('Error in createARMedia:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateARMedia(req: Request, res: Response) {
  try {
    const { routeId, mediaId } = req.params;
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const updatedARMedia = await arMediaService.updateARMedia(routeId, mediaId, file);
    res.json(updatedARMedia);
  } catch (error) {
    console.error('Error in updateARMedia:', error);
    if (error instanceof Error && error.message === 'AR Media not found') {
      res.status(404).json({ error: 'AR Media not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function deleteARMedia(req: Request, res: Response) {
  try {
    const { routeId, mediaId } = req.params;
    await arMediaService.deleteARMedia(routeId, mediaId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteARMedia:', error);
    if (error instanceof Error && error.message === 'AR Media not found') {
      res.status(404).json({ error: 'AR Media not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
