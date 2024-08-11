import { Request, Response, NextFunction } from 'express';
import * as routeService from '@/services/routeService';
import { NotFoundError, ValidationError } from '@/utils/errorHandler';

export async function getAllRoutes(req: Request, res: Response, next: NextFunction) {
  try {
    const routes = await routeService.getAllRoutes();
    res.json(routes);
  } catch (error) {
    next(error);
  }
}

export async function getRouteById(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const route = await routeService.getRouteById(routeId);
    res.json(route);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Route not found')) {
      next(new NotFoundError(`Route with id ${req.params.routeId} not found`));
    } else {
      next(error);
    }
  }
}

export async function updateRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const { routeId } = req.params;
    const routeData = req.body;
    const updatedRoute = await routeService.updateRoute(routeId, routeData);
    res.json({ message: 'Route updated successfully', route: updatedRoute });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Route not found')) {
        next(new NotFoundError(`Route with id ${req.params.routeId} not found`));
      } else if (error.message.includes('Invalid route data')) {
        next(new ValidationError(error.message));
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
}
