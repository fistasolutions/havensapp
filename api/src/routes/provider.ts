/**
 * Provider Routes
 * API routes for provider functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireProvider } from '../middleware/roleAuth';
import {
  createProviderClientRelationship,
  getProviderClients,
  grantConsent,
  revokeConsent,
} from '../services/providerService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

const router = Router();

// All provider routes require authentication and provider role
router.use(authenticateToken);
router.use(requireProvider);

/**
 * GET /provider/dashboard
 * Get provider dashboard data
 */
router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const clients = await getProviderClients({
      providerId: userId,
      consentStatus: 'Granted',
    });

    res.json({
      providerId: userId,
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.consentStatus === 'Granted').length,
      pendingConsents: clients.filter((c) => c.consentStatus === 'Pending').length,
    });
  }),
);

/**
 * GET /provider/clients
 * Get provider's clients
 */
router.get(
  '/clients',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { consentStatus } = req.query;

    const clients = await getProviderClients({
      providerId: userId,
      consentStatus: consentStatus as any,
    });

    res.json({ clients });
  }),
);

/**
 * POST /provider/clients
 * Request access to a client
 */
router.post(
  '/clients',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { clientId } = req.body;

    if (!clientId) {
      throw new ApplicationError('Client ID is required', 400);
    }

    const relationship = await createProviderClientRelationship({
      providerId: userId,
      clientId,
    });

    res.status(201).json({ relationship });
  }),
);

export default router;

