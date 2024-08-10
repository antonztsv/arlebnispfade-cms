import express from 'express';
import * as routeController from '@/controllers/routeController.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, routeController.getAllRoutes);
router.get('/:routeId', authMiddleware, routeController.getRouteById);
router.put('/:routeId', authMiddleware, routeController.updateRoute);

export default router;
