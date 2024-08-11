import express from 'express';
import * as pullRequestController from '@/controllers/pullRequestController';
import { authMiddleware } from '@/middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, pullRequestController.listPullRequests);
router.post('/', authMiddleware, pullRequestController.createPullRequest);
router.get('/:pullNumber', authMiddleware, pullRequestController.getPullRequest);
router.put('/:pullNumber/merge', authMiddleware, pullRequestController.mergePullRequest);

export default router;
