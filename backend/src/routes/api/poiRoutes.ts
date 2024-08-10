import express from 'express';
import * as poiController from '@/controllers/poiController';
import { authMiddleware } from '@/middleware/auth';

const router = express.Router();

router.get('/:routeId/pois', authMiddleware, poiController.getPOIsForRoute);
router.get('/:routeId/pois/:poiId', authMiddleware, poiController.getPOIById);
router.post('/:routeId/pois', authMiddleware, poiController.createPOI);
router.put('/:routeId/pois/:poiId', authMiddleware, poiController.updatePOI);
router.delete('/:routeId/pois/:poiId', authMiddleware, poiController.deletePOI);

export default router;
