/**
 * Role-Based Access Control Middleware
 * Enforces role-based permissions for API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './errorHandler';

export type UserRole = 'Individual' | 'Provider' | 'Partner' | 'FamilyFriends' | 'Kid';

/**
 * Middleware to require specific role(s)
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as UserRole | undefined;

    if (!userRole) {
      throw new ApplicationError('Unauthorized', 401);
    }

    if (!allowedRoles.includes(userRole)) {
      throw new ApplicationError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403,
        'INSUFFICIENT_PERMISSIONS',
      );
    }

    next();
  };
};

/**
 * Middleware to require provider role
 */
export const requireProvider = requireRole('Provider');

/**
 * Middleware to require non-kid role (for features not available to kids)
 */
export const requireNonKid = requireRole('Individual', 'Provider', 'Partner', 'FamilyFriends');

