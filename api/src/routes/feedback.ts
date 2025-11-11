/**
 * Feedback Routes
 * API routes for user feedback collection
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createFeedback, getFeedback } from '../services/analyticsService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /feedback
 * Submit user feedback
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.user?.userId; // Optional - can be anonymous
    const { sessionType, rating, feedbackText, isAnonymous } = req.body;

    if (!sessionType || !rating) {
      throw new ApplicationError('Session type and rating are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new ApplicationError('Rating must be between 1 and 5', 400);
    }

    const feedback = await createFeedback({
      userId: isAnonymous ? undefined : userId,
      sessionType,
      rating,
      feedbackText,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      id: feedback.id,
      sessionType: feedback.sessionType,
      rating: feedback.rating,
      submittedAt: feedback.submittedAt,
    });
  }),
);

/**
 * GET /feedback (Internal use only - requires admin role)
 * Get user feedback
 */
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // In production, this would require admin role
    const { sessionType, startDate, endDate, minRating } = req.query;

    const feedback = await getFeedback({
      sessionType: sessionType as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      minRating: minRating ? parseInt(minRating as string, 10) : undefined,
    });

    res.json({ feedback });
  }),
);

export default router;

