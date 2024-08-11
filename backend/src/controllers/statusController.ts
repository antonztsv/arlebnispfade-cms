import { Request, Response, NextFunction } from 'express';

export async function getStatus(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      message: 'API is online',
      timestamp: new Date().toLocaleString('de-de', { timeZone: 'Europe/Berlin' }),
    });
  } catch (error) {
    next(error);
  }
}
