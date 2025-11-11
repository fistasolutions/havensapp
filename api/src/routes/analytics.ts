/**
 * Analytics Routes
 * API routes for analytics collection
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { trackEventHandler, getAggregatedAnalyticsHandler } from '../controllers/analyticsController';

const router = Router();

// POST /analytics/events - Track analytics event (requires auth and consent)
router.post('/events', authenticateToken, trackEventHandler);

// GET /analytics/aggregated - Get aggregated analytics (internal use only)
// In production, this would require admin authentication
router.get('/aggregated', authenticateToken, getAggregatedAnalyticsHandler);

export default router;

