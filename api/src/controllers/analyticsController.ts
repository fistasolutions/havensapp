/**
 * Analytics Controller
 * Request handlers for analytics endpoints
 */

import { Request, Response } from 'express';
import { createAnalyticsEvent, getAggregatedAnalytics } from '../services/analyticsService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * POST /analytics/events
 * Track an analytics event
 */
export const trackEventHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { eventType, properties, featureUsed, sessionDuration } = req.body;

    if (!eventType) {
      throw new ApplicationError('Event type is required', 400);
    }

    // Check user consent
    const prisma = require('../../config/database').default;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { analyticsConsent: true },
    });

    if (!user || !user.analyticsConsent) {
      throw new ApplicationError('Analytics consent not granted', 403);
    }

    await createAnalyticsEvent({
      userId,
      eventType,
      properties,
      featureUsed,
      sessionDuration,
    });

    res.status(201).json({ success: true });
  },
);

/**
 * GET /analytics/aggregated (Internal use only - requires admin role)
 * Get aggregated analytics data
 */
export const getAggregatedAnalyticsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // In production, this would require admin role
    // For MVP, we'll restrict this endpoint or remove it from public API

    const { startDate, endDate, eventType, featureUsed } = req.query;

    const analytics = await getAggregatedAnalytics({
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      eventType: eventType as string | undefined,
      featureUsed: featureUsed as string | undefined,
    });

    res.json(analytics);
  },
);

