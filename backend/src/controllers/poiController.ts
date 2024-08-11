import { Request, Response, NextFunction } from 'express';
import * as poiService from '@/services/poiService';
import { ValidationError, NotFoundError, ConflictError } from '@/utils/errorHandler';

export async function getPOIsForRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const pois = await poiService.getPOIsForRoute(routeId);
    res.json(pois);
  } catch (error) {
    next(error);
  }
}

export async function getPOIById(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId, poiId } = req.params;
    const poi = await poiService.getPOIById(routeId, poiId);
    if (!poi) {
      throw new NotFoundError(`POI with id ${poiId} not found in route ${routeId}`);
    }
    res.json(poi);
  } catch (error) {
    next(error);
  }
}

export async function createPOI(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const poiData = req.body;
    const newPoi = await poiService.createPOI(routeId, poiData);
    res.status(201).json(newPoi);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid POI data')) {
      next(new ValidationError(error.message));
    } else {
      next(error);
    }
  }
}

export async function updatePOI(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId, poiId } = req.params;
    const poiData = req.body;
    const updatedPoi = await poiService.updatePOI(routeId, poiId, poiData);
    if (!updatedPoi) {
      throw new NotFoundError(`POI with id ${poiId} not found in route ${routeId}`);
    }
    res.json(updatedPoi);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid POI data')) {
        next(new ValidationError(error.message));
      } else if (error.message.includes('No changes detected')) {
        next(new ConflictError(error.message));
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
}

export async function deletePOI(req: Request, res: Response, next: NextFunction) {
  const { routeId, poiId } = req.params;
  try {
    await poiService.deletePOI(routeId, poiId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === 'POI not found') {
      next(new NotFoundError(`POI with id ${poiId} not found in route ${routeId}`));
    } else {
      next(error);
    }
  }
}
