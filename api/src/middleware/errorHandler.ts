/**
 * Error Handling Middleware
 * Centralized error handling for Express application
 */

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

/**
 * Custom error class for application errors
 */
export class ApplicationError extends Error implements AppError {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    code: err.code,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Prepare error response
  const errorResponse: {
    error: string;
    message: string;
    code?: string;
    stack?: string;
  } = {
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  };

  // Add error code if present
  if (err.code) {
    errorResponse.code = err.code;
  }

  // Include stack trace in development
  if (isDevelopment && err.stack) {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

