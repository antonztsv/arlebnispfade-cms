import express from 'express';
import * as pullRequestController from '@/controllers/pullRequestController';

const router = express.Router();

router.get('/', pullRequestController.listPullRequests);
router.post('/', pullRequestController.createPullRequest);
router.get('/:pullNumber', pullRequestController.getPullRequest);
router.put('/:pullNumber/merge', pullRequestController.mergePullRequest);

export default router;
