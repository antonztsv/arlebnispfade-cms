import express from 'express';
import statusRoutes from './api/statusRoutes';
import authRoutes from './api/authRoutes';
import contentRoutes from './api/contentRoutes';
import routeRoutes from './api/routeRoutes';

const router = express.Router();

// Public status route
router.use('/', statusRoutes);

// Auth routes
router.use('/auth', authRoutes);

// CMS routes
router.use('/content', contentRoutes);
router.use('/routes', routeRoutes);

export default router;
