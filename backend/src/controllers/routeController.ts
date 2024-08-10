import { Request, Response } from 'express';
import * as routeService from '@/services/routeService';

export async function getAllRoutes(req: Request, res: Response) {
  try {
    const routes = await routeService.getAllRoutes();
    res.json(routes);
  } catch (error) {
    console.error('Error in getAllRoutes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getRouteById(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const route = await routeService.getRouteById(routeId);
    res.json(route);
  } catch (error) {
    console.error('Error in getRouteById:', error);
    if (error instanceof Error && error.message.includes('Route not found')) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function updateRoute(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const routeData = req.body;
    const updatedRoute = await routeService.updateRoute(routeId, routeData);
    res.json({ message: 'Route updated successfully', route: updatedRoute });
  } catch (error) {
    console.error('Error in updateRoute:', error);
    if (error instanceof Error && error.message.includes('Route not found')) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
