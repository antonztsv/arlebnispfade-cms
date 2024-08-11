import express from 'express';
import statusRoutes from '@/routes/api/statusRoutes';
import authRoutes from '@/routes/api/authRoutes';
import contentRoutes from '@/routes/api/contentRoutes';
import routeRoutes from '@/routes/api/routeRoutes';
import poiRoutes from '@/routes/api/poiRoutes';
import pullRequestRoutes from '@/routes/api/pullRequestRoutes';

const router = express.Router();

// Public status route
router.use('/', statusRoutes);

// Auth routes
router.use('/auth', authRoutes);

// CMS routes
router.use('/content', contentRoutes);
router.use('/routes', routeRoutes);
router.use('/routes', poiRoutes);
router.use('/pull-requests', pullRequestRoutes);

export default router;
