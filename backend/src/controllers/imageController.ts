import { Request, Response, NextFunction } from 'express';
import * as imageService from '@/services/imageService';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

export async function getImagesForRoute(req: Request, res: Response, next: NextFunction) {
  const { routeId } = req.params;
  try {
    const images = await imageService.getImagesForRoute(routeId);
    res.json(images);
  } catch (error) {
    if (error instanceof Error && error.message === 'Route not found') {
      next(new NotFoundError(`Route with id ${routeId} not found`));
    } else {
      next(error);
    }
  }
}

export async function getImageById(req: Request, res: Response, next: NextFunction) {
  const { routeId, imageId } = req.params;
  try {
    const image = await imageService.getImageById(routeId, imageId);
    res.json(image);
  } catch (error) {
    if (error instanceof Error && error.message === 'Image not found') {
      next(new NotFoundError(`Image with id ${imageId} not found in route ${routeId}`));
    } else {
      next(error);
    }
  }
}

export async function createImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const file = req.file as Express.Multer.File;
    const isSmallImage = req.body.isSmallImage === 'true';

    if (!file) {
      throw new ValidationError('No file uploaded');
    }
    const newImage = await imageService.createImage(routeId, file, isSmallImage);
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
}

export async function updateImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId, imageId } = req.params;
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new ValidationError('No file uploaded');
    }
    const updatedImage = await imageService.updateImage(routeId, imageId, file);
    res.json(updatedImage);
  } catch (error) {
    if (error instanceof Error && error.message === 'Image not found') {
      next(
        new NotFoundError(
          `Image with id ${req.params.imageId} not found in route ${req.params.routeId}`,
        ),
      );
    } else {
      next(error);
    }
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  const { routeId, imageId } = req.params;
  try {
    await imageService.deleteImage(routeId, imageId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === 'Image not found') {
      next(new NotFoundError(`Image with id ${imageId} not found in route ${routeId}`));
    } else {
      next(error);
    }
  }
}
