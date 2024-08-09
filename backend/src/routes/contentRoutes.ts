import express from 'express';
import * as contentController from '../controllers/contentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/:path(*)', authMiddleware, contentController.getContent);
router.put('/:path(*)', authMiddleware, contentController.updateContent);

export default router;
