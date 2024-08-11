import { Request, Response, NextFunction } from 'express';
import * as arMediaService from '@/services/arMediaService';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

export async function getARMediaForRoute(req: Request, res: Response, next: NextFunction) {
  const { routeId } = req.params;
  try {
    const arMedia = await arMediaService.getARMediaForRoute(routeId);
    res.json(arMedia);
  } catch (error) {
    if (error instanceof Error && error.message === 'Route not found') {
      next(new NotFoundError(`Route with id ${routeId} not found`));
    } else {
      next(error);
    }
  }
}

export async function getARMediaById(req: Request, res: Response, next: NextFunction) {
  const { routeId, mediaId } = req.params;
  try {
    const arMedia = await arMediaService.getARMediaById(routeId, mediaId);
    res.json(arMedia);
  } catch (error) {
    if (error instanceof Error && error.message === 'AR Media not found') {
      next(new NotFoundError(`AR Media with id ${mediaId} not found in route ${routeId}`));
    } else {
      next(error);
    }
  }
}

export async function createARMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new ValidationError('No file uploaded');
    }
    const newARMedia = await arMediaService.createARMedia(routeId, file);
    res.status(201).json(newARMedia);
  } catch (error) {
    next(error);
  }
}

export async function updateARMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId, mediaId } = req.params;
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new ValidationError('No file uploaded');
    }
    const updatedARMedia = await arMediaService.updateARMedia(routeId, mediaId, file);
    res.json(updatedARMedia);
  } catch (error) {
    if (error instanceof Error && error.message === 'AR Media not found') {
      next(
        new NotFoundError(
          `AR Media with id ${req.params.mediaId} not found in route ${req.params.routeId}`,
        ),
      );
    } else {
      next(error);
    }
  }
}

export async function deleteARMedia(req: Request, res: Response, next: NextFunction) {
  const { routeId, mediaId } = req.params;
  try {
    await arMediaService.deleteARMedia(routeId, mediaId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === 'AR Media not found') {
      next(new NotFoundError(`AR Media with id ${mediaId} not found in route ${routeId}`));
    } else {
      next(error);
    }
  }
}
