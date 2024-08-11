import { Request, Response } from 'express';
import * as pullRequestService from '@/services/pullRequestService';

export async function listPullRequests(req: Request, res: Response) {
  try {
    const pullRequests = await pullRequestService.listPullRequests();
    res.json(pullRequests);
  } catch (error) {
    console.error('Error in listPullRequests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getPullRequest(req: Request, res: Response) {
  try {
    const { pullNumber } = req.params;
    const pullRequest = await pullRequestService.getPullRequest(Number(pullNumber));
    res.json(pullRequest);
  } catch (error) {
    console.error('Error in getPullRequest:', error);
    if (error instanceof Error && error.message === 'This is not a CMS-created pull request') {
      res.status(403).json({ error: 'This is not a CMS-created pull request' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function createPullRequest(req: Request, res: Response) {
  try {
    const { baseBranch, headBranch, title, body } = req.body;
    const pullRequest = await pullRequestService.createPullRequest(
      baseBranch,
      headBranch,
      title,
      body,
    );
    res.status(201).json(pullRequest);
  } catch (error) {
    console.error('Error in createPullRequest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function mergePullRequest(req: Request, res: Response) {
  try {
    const { pullNumber } = req.params;
    const mergeResult = await pullRequestService.mergePullRequest(Number(pullNumber));
    res.json(mergeResult);
  } catch (error) {
    console.error('Error in mergePullRequest:', error);
    if (error instanceof Error && error.message === 'This is not a CMS-created pull request') {
      res.status(403).json({ error: 'This is not a CMS-created pull request' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
