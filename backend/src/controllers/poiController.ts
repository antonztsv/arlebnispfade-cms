// src/controllers/poiController.ts

import { Request, Response } from 'express';
import * as poiService from '@/services/poiService';

export async function getPOIsForRoute(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const pois = await poiService.getPOIsForRoute(routeId);
    res.json(pois);
  } catch (error) {
    console.error('Error in getPOIsForRoute:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getPOIById(req: Request, res: Response) {
  try {
    const { routeId, poiId } = req.params;
    const poi = await poiService.getPOIById(routeId, poiId);
    res.json(poi);
  } catch (error) {
    console.error('Error in getPOIById:', error);
    if (error instanceof Error && error.message === 'POI not found') {
      res.status(404).json({ error: 'POI not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function createPOI(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const poiData = req.body;
    const newPoi = await poiService.createPOI(routeId, poiData);
    res.status(201).json(newPoi);
  } catch (error) {
    console.error('Error in createPOI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updatePOI(req: Request, res: Response) {
  try {
    const { routeId, poiId } = req.params;
    const poiData = req.body;
    const updatedPoi = await poiService.updatePOI(routeId, poiId, poiData);
    res.json(updatedPoi);
  } catch (error) {
    console.error('Error in updatePOI:', error);
    if (error instanceof Error && error.message === 'POI not found') {
      res.status(404).json({ error: 'POI not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function deletePOI(req: Request, res: Response) {
  try {
    const { routeId, poiId } = req.params;
    await poiService.deletePOI(routeId, poiId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deletePOI:', error);
    if (error instanceof Error && error.message === 'POI not found') {
      res.status(404).json({ error: 'POI not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
