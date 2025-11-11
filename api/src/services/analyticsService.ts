/**
 * Analytics Service
 * Business logic for privacy-compliant analytics collection with anonymization
 */

import prisma from '../config/database';
import { createHash } from 'crypto';

export interface CreateAnalyticsEventData {
  userId: string;
  eventType: string;
  properties?: Record<string, unknown>;
  featureUsed?: string;
  sessionDuration?: number;
}

export interface CreateFeedbackData {
  userId?: string;
  sessionType: 'Chatbot' | 'MoodLogging' | 'Journaling' | 'Exercise' | 'General';
  rating: number;
  feedbackText?: string;
  isAnonymous?: boolean;
}

/**
 * Anonymize user ID using SHA-256 hash
 */
const anonymizeUserId = (userId: string): string => {
  return createHash('sha256').update(userId).digest('hex');
};

/**
 * Create an analytics event (only if user has consent)
 */
export const createAnalyticsEvent = async (data: CreateAnalyticsEventData) => {
  // Check user consent
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { analyticsConsent: true },
  });

  if (!user || !user.analyticsConsent) {
    throw new Error('Analytics consent not granted');
  }

  // Anonymize user ID
  const anonymizedUserId = anonymizeUserId(data.userId);

  // Extract feature from properties if not provided
  const featureUsed = data.featureUsed || (data.properties?.feature as string) || null;

  // Create event
  const event = await prisma.analyticsEvent.create({
    data: {
      eventType: data.eventType,
      anonymizedUserId,
      featureUsed,
      sessionDuration: data.sessionDuration,
      metadata: data.properties as any,
    },
  });

  return event;
};

/**
 * Get aggregated analytics (for internal use only)
 */
export const getAggregatedAnalytics = async (params: {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  featureUsed?: string;
}) => {
  const where: any = {};

  if (params.startDate || params.endDate) {
    where.timestamp = {};
    if (params.startDate) {
      where.timestamp.gte = params.startDate;
    }
    if (params.endDate) {
      where.timestamp.lte = params.endDate;
    }
  }

  if (params.eventType) {
    where.eventType = params.eventType;
  }

  if (params.featureUsed) {
    where.featureUsed = params.featureUsed;
  }

  const events = await prisma.analyticsEvent.findMany({
    where,
    select: {
      eventType: true,
      featureUsed: true,
      sessionDuration: true,
      timestamp: true,
      // Don't return anonymizedUserId or metadata to prevent re-identification
    },
  });

  // Aggregate data
  const aggregated = {
    totalEvents: events.length,
    eventsByType: {} as Record<string, number>,
    eventsByFeature: {} as Record<string, number>,
    averageSessionDuration: 0,
  };

  let totalDuration = 0;
  let durationCount = 0;

  events.forEach((event) => {
    aggregated.eventsByType[event.eventType] =
      (aggregated.eventsByType[event.eventType] || 0) + 1;

    if (event.featureUsed) {
      aggregated.eventsByFeature[event.featureUsed] =
        (aggregated.eventsByFeature[event.featureUsed] || 0) + 1;
    }

    if (event.sessionDuration) {
      totalDuration += event.sessionDuration;
      durationCount++;
    }
  });

  if (durationCount > 0) {
    aggregated.averageSessionDuration = Math.round(totalDuration / durationCount);
  }

  return aggregated;
};

/**
 * Create user feedback
 */
export const createFeedback = async (data: CreateFeedbackData) => {
  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const feedback = await prisma.userFeedback.create({
    data: {
      userId: data.isAnonymous ? null : data.userId || null,
      sessionType: data.sessionType as any,
      rating: data.rating,
      feedbackText: data.feedbackText || null,
      isAnonymous: data.isAnonymous || false,
    },
  });

  return feedback;
};

/**
 * Get user feedback (for internal use only)
 */
export const getFeedback = async (params: {
  sessionType?: string;
  startDate?: Date;
  endDate?: Date;
  minRating?: number;
}) => {
  const where: any = {};

  if (params.sessionType) {
    where.sessionType = params.sessionType;
  }

  if (params.startDate || params.endDate) {
    where.submittedAt = {};
    if (params.startDate) {
      where.submittedAt.gte = params.startDate;
    }
    if (params.endDate) {
      where.submittedAt.lte = params.endDate;
    }
  }

  if (params.minRating) {
    where.rating = { gte: params.minRating };
  }

  const feedback = await prisma.userFeedback.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true,
      sessionType: true,
      rating: true,
      feedbackText: true,
      submittedAt: true,
      // Don't return userId to maintain privacy
    },
  });

  return feedback;
};

