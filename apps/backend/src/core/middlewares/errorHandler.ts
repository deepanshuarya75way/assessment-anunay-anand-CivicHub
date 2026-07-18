import { Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger';
import { AppError } from '../exceptions';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error:', err);

  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.status,
      err.code,
      err.details,
      err.stack
    );
  }

  // Handle Zod Errors explicitly if needed, or mongoose errors
  if (err.name === 'ZodError') {
    return ApiResponse.error(res, 'Validation Error', 400, 'VALIDATION_ERROR', err.errors, err.stack);
  }

  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, err.message, 400, 'VALIDATION_ERROR', err.errors, err.stack);
  }

  // Fallback for unknown errors
  return ApiResponse.error(
    res,
    'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR',
    undefined,
    err.stack
  );
};
