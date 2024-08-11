import express from 'express';
import * as pullRequestController from '@/controllers/pullRequestController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, pullRequestController.listPullRequests);
router.get('/:pullNumber', authMiddleware, pullRequestController.getPullRequest);
router.put('/:pullNumber/merge', authMiddleware, pullRequestController.mergePullRequest);
router.delete('/:pullNumber', authMiddleware, pullRequestController.deletePullRequest);

export default router;
