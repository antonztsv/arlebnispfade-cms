import express from 'express';
import * as arPreviewController from '@/controllers/arPreviewController';
import { arPreviewAuthMiddleware } from '@/middleware/arPreviewAuthMiddleware';

const router = express.Router();

router.get('/:routeId/:poiId', arPreviewAuthMiddleware, arPreviewController.getARPreview);

export default router;
