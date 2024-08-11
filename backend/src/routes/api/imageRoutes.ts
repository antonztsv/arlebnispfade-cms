import express from 'express';
import multer from 'multer';
import * as imageController from '@/controllers/imageController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:routeId/images', authMiddleware, imageController.getImagesForRoute);
router.get('/:routeId/images/:imageId', authMiddleware, imageController.getImageById);
router.post('/:routeId/images', authMiddleware, upload.single('file'), imageController.createImage);
router.put(
  '/:routeId/images/:imageId',
  authMiddleware,
  upload.single('file'),
  imageController.updateImage,
);
router.delete('/:routeId/images/:imageId', authMiddleware, imageController.deleteImage);

export default router;
