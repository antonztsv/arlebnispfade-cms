import { Request, Response, NextFunction } from 'express';
import * as pullRequestService from '@/services/pullRequestService';
import { NotFoundError, ForbiddenError } from '@/utils/errorHandler';

export async function listPullRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const pullRequests = await pullRequestService.getAllPullRequests();
    res.json(pullRequests);
  } catch (error) {
    next(error);
  }
}

export async function getPullRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { pullNumber } = req.params;
    const pullRequest = await pullRequestService.getPullRequest(Number(pullNumber));
    res.json(pullRequest);
  } catch (error) {
    if (error instanceof Error && error.message === 'This is not a CMS-created pull request') {
      next(new ForbiddenError(error.message));
    } else {
      next(error);
    }
  }
}

export async function mergePullRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { pullNumber } = req.params;
    const mergeResult = await pullRequestService.mergePullRequest(Number(pullNumber));
    res.json(mergeResult);
  } catch (error) {
    if (error instanceof Error && error.message === 'This is not a CMS-created pull request') {
      next(new ForbiddenError(error.message));
    } else {
      next(error);
    }
  }
}

export async function deletePullRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { pullNumber } = req.params;
    const deleteResult = await pullRequestService.deletePullRequest(Number(pullNumber));
    res.json(deleteResult);
  } catch (error) {
    if (error instanceof Error && error.message === 'This is not a CMS-created pull request') {
      next(new ForbiddenError(error.message));
    } else {
      next(error);
    }
  }
}
