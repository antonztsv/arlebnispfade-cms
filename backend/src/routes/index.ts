import express from 'express';
import statusRoutes from '@/routes/api/statusRoutes';
import authRoutes from '@/routes/api/authRoutes';
import routeRoutes from '@/routes/api/routeRoutes';
import poiRoutes from '@/routes/api/poiRoutes';
import pullRequestRoutes from '@/routes/api/pullRequestRoutes';
import arMediaRoutes from '@/routes/api/arMediaRoutes';
import imageRoutes from '@/routes/api/imageRoutes';
import arPreviewRoutes from '@/routes/api/arPreviewRoutes';

const router = express.Router();

// Public status route
router.use('/', statusRoutes);

// Auth routes
router.use('/auth', authRoutes);

// CMS routes
router.use('/routes', routeRoutes);
router.use('/routes', poiRoutes);
router.use('/routes', arMediaRoutes);
router.use('/routes', imageRoutes);
router.use('/pull-requests', pullRequestRoutes);
router.use('/ar-preview', arPreviewRoutes);

export default router;
