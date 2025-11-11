/**
 * User Routes
 * API routes for user profile and data management
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { exportDataHandler, deleteDataHandler } from '../controllers/dataController';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';
import prisma from '../config/database';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

/**
 * GET /user/profile
 * Get user profile
 */
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        age: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    res.json(user);
  }),
);

/**
 * PUT /user/profile
 * Update user profile
 */
router.put(
  '/profile',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { firstName, lastName, age } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        age: age ? parseInt(age, 10) : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
      },
    });

    res.json(user);
  }),
);

/**
 * GET /user/privacy
 * Get privacy settings
 */
router.get(
  '/privacy',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        analyticsConsent: true,
        dataRetentionPreference: true,
      },
    });

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    res.json({
      analyticsConsent: user.analyticsConsent,
      dataRetentionPreference: user.dataRetentionPreference,
    });
  }),
);

/**
 * PUT /user/privacy
 * Update privacy settings
 */
router.put(
  '/privacy',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { analyticsConsent, dataRetentionPreference } = req.body;

    // Validate data retention (minimum 30 days, maximum 3650 days)
    if (dataRetentionPreference !== undefined) {
      if (dataRetentionPreference < 30 || dataRetentionPreference > 3650) {
        throw new ApplicationError(
          'Data retention must be between 30 and 3650 days',
          400,
        );
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        analyticsConsent:
          analyticsConsent !== undefined ? analyticsConsent : undefined,
        dataRetentionPreference:
          dataRetentionPreference !== undefined
            ? dataRetentionPreference
            : undefined,
      },
    });

    res.json({ success: true });
  }),
);

/**
 * GET /user/data/export
 * Export all user data
 */
router.get('/data/export', exportDataHandler);

/**
 * DELETE /user/data
 * Delete user account and all data
 */
router.delete('/data', deleteDataHandler);

export default router;

