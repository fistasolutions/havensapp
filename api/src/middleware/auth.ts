/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to request
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token from Authorization header
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Token expired') {
          res.status(401).json({
            error: 'Unauthorized',
            message: 'Token expired',
            code: 'TOKEN_EXPIRED',
          });
          return;
        }
        if (error.message === 'Invalid token') {
          res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token',
            code: 'INVALID_TOKEN',
          });
          return;
        }
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        req.user = payload;
      } catch (error) {
        // Ignore errors for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

/**
 * Role-based authorization middleware factory
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

