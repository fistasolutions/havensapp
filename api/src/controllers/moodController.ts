/**
 * Mood Controller
 * Request handlers for mood endpoints
 */

import { Request, Response } from 'express';
import {
  createMoodEntry,
  getMoodEntries,
  getMoodTrends,
  exportMoodData,
} from '../services/moodService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * POST /mood/entries
 * Create a new mood entry
 */
export const createMoodEntryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { emotionLabels, intensity, notes } = req.body;

    if (!emotionLabels || !Array.isArray(emotionLabels) || emotionLabels.length === 0) {
      throw new ApplicationError('At least one emotion label is required', 400);
    }

    if (intensity !== undefined && (intensity < 1 || intensity > 10)) {
      throw new ApplicationError('Intensity must be between 1 and 10', 400);
    }

    const moodEntry = await createMoodEntry({
      userId,
      emotionLabels,
      intensity,
      notes,
    });

    res.status(201).json({
      id: moodEntry.id,
      userId: moodEntry.userId,
      emotionLabels: moodEntry.emotionLabels,
      intensity: moodEntry.intensity,
      timestamp: moodEntry.timestamp,
      createdAt: moodEntry.createdAt,
    });
  },
);

/**
 * GET /mood/entries
 * Get mood entries for the current user
 */
export const getMoodEntriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { startDate, endDate, limit } = req.query;

    const entries = await getMoodEntries({
      userId,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        userId: entry.userId,
        emotionLabels: entry.emotionLabels,
        intensity: entry.intensity,
        timestamp: entry.timestamp,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    });
  },
);

/**
 * GET /mood/trends
 * Get mood trends for the current user
 */
export const getMoodTrendsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { period } = req.query;

    const validPeriods = ['Daily', 'Weekly', 'Monthly'];
    const selectedPeriod = (period as string) || 'Weekly';

    if (!validPeriods.includes(selectedPeriod)) {
      throw new ApplicationError('Invalid period. Must be Daily, Weekly, or Monthly', 400);
    }

    const trends = await getMoodTrends({
      userId,
      period: selectedPeriod as 'Daily' | 'Weekly' | 'Monthly',
    });

    res.json(trends);
  },
);

/**
 * GET /mood/export
 * Export mood data for the current user
 */
export const exportMoodDataHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const data = await exportMoodData(userId);

    res.json(data);
  },
);

