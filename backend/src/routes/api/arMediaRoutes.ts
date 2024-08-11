import express from 'express';
import multer from 'multer';
import * as arMediaController from '@/controllers/arMediaController';
import { authMiddleware } from '@/middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:routeId/ar-media', authMiddleware, arMediaController.getARMediaForRoute);
router.get('/:routeId/ar-media/:mediaId', authMiddleware, arMediaController.getARMediaById);
router.post(
  '/:routeId/ar-media',
  authMiddleware,
  upload.single('file'),
  arMediaController.createARMedia,
);
router.put(
  '/:routeId/ar-media/:mediaId',
  authMiddleware,
  upload.single('file'),
  arMediaController.updateARMedia,
);
router.delete('/:routeId/ar-media/:mediaId', authMiddleware, arMediaController.deleteARMedia);

export default router;
