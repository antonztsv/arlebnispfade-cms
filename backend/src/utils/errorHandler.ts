import { Response } from 'express';
import { ErrorType, ApiError } from '@/types/errors';

export class AppError extends Error implements ApiError {
  constructor(
    public type: ErrorType,
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export const handleError = (error: Error | AppError, res: Response) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  } else {
    console.error('Unhandled error:', error);
    res.status(500).json({
      type: ErrorType.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    });
  }
};

export class ValidationError extends AppError {
  constructor(message: string) {
    super(ErrorType.VALIDATION_ERROR, 400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(ErrorType.NOT_FOUND, 404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(ErrorType.UNAUTHORIZED, 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(ErrorType.FORBIDDEN, 403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorType.CONFLICT, 409, message);
  }
}
