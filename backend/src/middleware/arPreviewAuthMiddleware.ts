import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { UnauthorizedError } from '@/utils/errorHandler';

export const arPreviewAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    (req as any).userId = (decoded as any).userId;
    (req as any).userRole = (decoded as any).role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};
