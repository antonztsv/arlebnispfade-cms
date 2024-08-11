import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '@/utils/errorHandler';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  handleError(err, res);
};
