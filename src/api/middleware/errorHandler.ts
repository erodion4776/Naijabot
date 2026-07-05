import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    req: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  }, '💥 Server Error caught by central middleware');

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
