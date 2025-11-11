/**
 * Mood Service
 * Handles mood tracking API communication and local state management
 */

import { apiClient } from '../api/client';
import { queueOfflineAction, isOnline } from '../storage/sync';
import { getItem, setItem } from '../storage/localStorage';

export interface MoodEntry {
  id: string;
  userId: string;
  emotionLabels: string[];
  intensity?: number;
  notes?: string;
  moodColor?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodTrend {
  periodStart: string;
  periodEnd: string;
  averageMood: number;
  dominantEmotions: string[];
  trendDirection: 'Improving' | 'Stable' | 'Declining';
  entryCount: number;
}

export interface MoodTrendsResponse {
  period: 'Daily' | 'Weekly' | 'Monthly';
  trends: MoodTrend[];
}

export interface LogMoodData {
  emotionLabels: string[];
  intensity?: number;
  notes?: string;
}

export interface GetMoodEntriesParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

const MOOD_ENTRIES_CACHE_KEY = '@havensapp:moodEntries';

class MoodService {
  /**
   * Log a mood entry
   */
  async logMood(data: LogMoodData): Promise<MoodEntry> {
    try {
      const online = await isOnline();

      if (!online) {
        // Queue for offline sync
        await queueOfflineAction({
          type: 'mood',
          action: 'create',
          endpoint: '/mood/entries',
          data,
        });

        // Create local entry for immediate UI feedback
        const localEntry: MoodEntry = {
          id: `local-${Date.now()}`,
          userId: 'local',
          emotionLabels: data.emotionLabels,
          intensity: data.intensity,
          notes: data.notes,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Cache locally
        const cached = await getItem<MoodEntry[]>(MOOD_ENTRIES_CACHE_KEY) || [];
        cached.push(localEntry);
        await setItem(MOOD_ENTRIES_CACHE_KEY, cached);

        return localEntry;
      }

      const response = await apiClient.post<MoodEntry>('/mood/entries', data);

      // Update cache
      const cached = await getItem<MoodEntry[]>(MOOD_ENTRIES_CACHE_KEY) || [];
      cached.push(response.data);
      await setItem(MOOD_ENTRIES_CACHE_KEY, cached);

      return response.data;
    } catch (error) {
      console.error('Error logging mood:', error);

      // Retry logic for network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code?: string }).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNABORTED') {
          // Queue for retry
          await queueOfflineAction({
            type: 'mood',
            action: 'create',
            endpoint: '/mood/entries',
            data,
          });

          // Create local entry
          const localEntry: MoodEntry = {
            id: `local-${Date.now()}`,
            userId: 'local',
            emotionLabels: data.emotionLabels,
            intensity: data.intensity,
            notes: data.notes,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const cached = await getItem<MoodEntry[]>(MOOD_ENTRIES_CACHE_KEY) || [];
          cached.push(localEntry);
          await setItem(MOOD_ENTRIES_CACHE_KEY, cached);

          return localEntry;
        }
      }

      throw error;
    }
  }

  /**
   * Get mood entries for the current user
   */
  async getMoodEntries(params?: GetMoodEntriesParams): Promise<MoodEntry[]> {
    try {
      const response = await apiClient.get<{ entries: MoodEntry[] }>('/mood/entries', {
        params,
      });

      // Update cache
      await setItem(MOOD_ENTRIES_CACHE_KEY, response.data.entries);

      return response.data.entries;
    } catch (error) {
      console.error('Error fetching mood entries:', error);

      // Return cached entries if available
      const cached = await getItem<MoodEntry[]>(MOOD_ENTRIES_CACHE_KEY);
      if (cached) {
        return cached;
      }

      throw error;
    }
  }

  /**
   * Get mood trends
   */
  async getMoodTrends(period: 'Daily' | 'Weekly' | 'Monthly' = 'Weekly'): Promise<MoodTrendsResponse> {
    try {
      const response = await apiClient.get<MoodTrendsResponse>('/mood/trends', {
        params: { period },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching mood trends:', error);
      throw error;
    }
  }

  /**
   * Export mood data
   */
  async exportMoodData(): Promise<{ entries: MoodEntry[]; trends: MoodTrend[] }> {
    try {
      const response = await apiClient.get<{ entries: MoodEntry[]; trends: MoodTrend[] }>(
        '/mood/export',
      );

      return response.data;
    } catch (error) {
      console.error('Error exporting mood data:', error);
      throw error;
    }
  }

  /**
   * Get cached mood entries (for offline access)
   */
  async getCachedMoodEntries(): Promise<MoodEntry[]> {
    return (await getItem<MoodEntry[]>(MOOD_ENTRIES_CACHE_KEY)) || [];
  }
}

export const moodService = new MoodService();

