/**
 * Data Controller
 * Request handlers for data export and deletion
 */

import { Request, Response } from 'express';
import { exportUserData, deleteUserData } from '../services/dataService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * GET /user/data/export
 * Export all user data
 */
export const exportDataHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const exportedData = await exportUserData(userId);

    res.json(exportedData);
  },
);

/**
 * DELETE /user/data
 * Delete user account and all data
 */
export const deleteDataHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    await deleteUserData(userId);

    res.json({ success: true, message: 'Account and all data deleted' });
  },
);

