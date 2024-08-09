import { Request, Response } from 'express';
import * as routeService from '../services/routeService.js';

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateRoute(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const routeData = req.body;
    await routeService.updateRoute(routeId, routeData);
    res.json({ message: 'Route updated successfully' });
  } catch (error) {
    console.error('Error in updateRoute:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
