import config from '@/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenPayloadSchema, TokenPayload } from '@/schemas/authSchema';
import { UnauthorizedError, ForbiddenError } from '@/utils/errorHandler';

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET must be set in .env');
}
const JWT_SECRET = config.jwtSecret;

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new UnauthorizedError('No token provided'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = tokenPayloadSchema.safeParse(decoded);
    if (!result.success) {
      return next(new UnauthorizedError('Invalid token payload'));
    }
    const payload = result.data as TokenPayload;
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return next(new ForbiddenError('Access denied'));
    }
    next();
  };
};
