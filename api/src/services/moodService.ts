/**
 * Mood Service
 * Business logic for mood tracking
 */

import prisma from '../config/database';

export interface CreateMoodEntryData {
  userId: string;
  emotionLabels: string[];
  intensity?: number;
  notes?: string;
}

export interface GetMoodEntriesParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface GetMoodTrendsParams {
  userId: string;
  period: 'Daily' | 'Weekly' | 'Monthly';
}

/**
 * Create a mood entry
 */
export const createMoodEntry = async (data: CreateMoodEntryData) => {
  // Validate emotion labels
  if (!data.emotionLabels || data.emotionLabels.length === 0) {
    throw new Error('At least one emotion label is required');
  }

  // Validate intensity if provided
  if (data.intensity !== undefined && (data.intensity < 1 || data.intensity > 10)) {
    throw new Error('Intensity must be between 1 and 10');
  }

  const moodEntry = await prisma.moodEntry.create({
    data: {
      userId: data.userId,
      emotionLabels: data.emotionLabels,
      intensity: data.intensity,
      notes: data.notes,
      timestamp: new Date(),
      isOffline: false,
    },
  });

  return moodEntry;
};

/**
 * Get mood entries for a user
 */
export const getMoodEntries = async (params: GetMoodEntriesParams) => {
  const where: any = {
    userId: params.userId,
  };

  if (params.startDate || params.endDate) {
    where.timestamp = {};
    if (params.startDate) {
      where.timestamp.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      where.timestamp.lte = new Date(params.endDate);
    }
  }

  const entries = await prisma.moodEntry.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: params.limit || 100,
  });

  return entries;
};

/**
 * Calculate mood trends
 */
export const calculateMoodTrends = async (params: GetMoodTrendsParams) => {
  const { userId, period } = params;

  // Get mood entries for the user
  const entries = await prisma.moodEntry.findMany({
    where: { userId },
    orderBy: { timestamp: 'asc' },
  });

  if (entries.length === 0) {
    return {
      period,
      trends: [],
    };
  }

  // Group entries by period
  const trends: any[] = [];
  const groupedEntries: { [key: string]: typeof entries } = {};

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp);
    let periodKey: string;

    if (period === 'Daily') {
      periodKey = date.toISOString().split('T')[0];
    } else if (period === 'Weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      periodKey = weekStart.toISOString().split('T')[0];
    } else {
      // Monthly
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!groupedEntries[periodKey]) {
      groupedEntries[periodKey] = [];
    }
    groupedEntries[periodKey].push(entry);
  });

  // Calculate trends for each period
  for (const [periodKey, periodEntries] of Object.entries(groupedEntries)) {
    const intensities = periodEntries
      .map((e) => e.intensity)
      .filter((i): i is number => i !== null && i !== undefined);

    const averageMood = intensities.length > 0
      ? intensities.reduce((sum, i) => sum + i, 0) / intensities.length
      : 0;

    // Find dominant emotions
    const emotionCounts: { [key: string]: number } = {};
    periodEntries.forEach((entry) => {
      entry.emotionLabels.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const dominantEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Determine trend direction (simplified - compare with previous period)
    let trendDirection: 'Improving' | 'Stable' | 'Declining' = 'Stable';
    if (trends.length > 0) {
      const prevAverage = trends[trends.length - 1].averageMood;
      if (averageMood > prevAverage + 0.5) {
        trendDirection = 'Improving';
      } else if (averageMood < prevAverage - 0.5) {
        trendDirection = 'Declining';
      }
    }

    const periodStart = new Date(periodKey);
    let periodEnd = new Date(periodStart);
    if (period === 'Daily') {
      periodEnd.setDate(periodEnd.getDate() + 1);
    } else if (period === 'Weekly') {
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    trends.push({
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
      averageMood,
      dominantEmotions,
      trendDirection,
      entryCount: periodEntries.length,
    });
  }

  return {
    period,
    trends: trends.sort((a, b) => a.periodStart.localeCompare(b.periodStart)),
  };
};

/**
 * Get mood trends (with caching/optimization)
 */
export const getMoodTrends = async (params: GetMoodTrendsParams) => {
  // Check if we have cached trends
  const cachedTrend = await prisma.moodTrend.findFirst({
    where: {
      userId: params.userId,
      period: params.period as any,
    },
    orderBy: { createdAt: 'desc' },
  });

  // If cached trend is recent (within last hour), use it
  if (cachedTrend && cachedTrend.createdAt > new Date(Date.now() - 3600000)) {
    // Return cached trends (would need to fetch all for the period)
    // For now, recalculate
  }

  // Calculate trends
  const trends = await calculateMoodTrends(params);

  // Optionally cache the trends
  // This would be done in a background job in production

  return trends;
};

/**
 * Export mood data for a user
 */
export const exportMoodData = async (userId: string) => {
  const entries = await prisma.moodEntry.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });

  const trends = await prisma.moodTrend.findMany({
    where: { userId },
    orderBy: { periodStart: 'desc' },
  });

  return {
    entries: entries.map((entry) => ({
      id: entry.id,
      emotionLabels: entry.emotionLabels,
      intensity: entry.intensity,
      timestamp: entry.timestamp,
      createdAt: entry.createdAt,
    })),
    trends: trends.map((trend) => ({
      period: trend.period,
      periodStart: trend.periodStart,
      periodEnd: trend.periodEnd,
      averageMood: trend.averageMood,
      dominantEmotions: trend.dominantEmotions,
      trendDirection: trend.trendDirection,
      entryCount: trend.entryCount,
    })),
  };
};

