/**
 * Partner Routes
 * API routes for partner pairing functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';
import prisma from '../config/database';
import { randomBytes } from 'crypto';

const router = Router();

// All partner routes require authentication
router.use(authenticateToken);

/**
 * POST /partner/generate-code
 * Generate a pairing code for partner invitation
 */
router.post(
  '/generate-code',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    // Generate unique pairing code
    const pairingCode = randomBytes(6).toString('hex').toUpperCase().slice(0, 12);

    // Check if user already has an active pairing
    const existingPairing = await prisma.partnerPairing.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        pairingStatus: 'Active',
      },
    });

    if (existingPairing) {
      throw new ApplicationError('User already has an active pairing', 400);
    }

    // Create pairing with pending status
    const pairing = await prisma.partnerPairing.create({
      data: {
        user1Id: userId,
        user2Id: userId, // Placeholder, will be updated when paired
        pairingCode,
        pairingStatus: 'Pending',
      },
    });

    res.json({ pairingCode, pairingId: pairing.id });
  }),
);

/**
 * POST /partner/pair
 * Pair with a partner using pairing code
 */
router.post(
  '/pair',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { pairingCode } = req.body;

    if (!pairingCode) {
      throw new ApplicationError('Pairing code is required', 400);
    }

    // Find pairing by code
    const pairing = await prisma.partnerPairing.findUnique({
      where: { pairingCode },
    });

    if (!pairing) {
      throw new ApplicationError('Invalid pairing code', 404);
    }

    if (pairing.pairingStatus !== 'Pending') {
      throw new ApplicationError('Pairing code is no longer valid', 400);
    }

    if (pairing.user1Id === userId) {
      throw new ApplicationError('Cannot pair with yourself', 400);
    }

    // Update pairing with user2
    const updated = await prisma.partnerPairing.update({
      where: { id: pairing.id },
      data: {
        user2Id: userId,
        pairingStatus: 'Active',
        pairedAt: new Date(),
      },
    });

    res.json({ pairing: updated });
  }),
);

export default router;

