/**
 * Unit Tests for Mood Service
 * Tests the mood service functionality
 */

import { moodService } from '../../src/services/mood/moodService';

// Mock API client
jest.mock('../../src/services/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock offline sync
jest.mock('../../src/services/storage/sync', () => ({
  isOnline: jest.fn(),
  queueOfflineAction: jest.fn(),
}));

describe('MoodService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logMood', () => {
    it('should log a mood entry with emotion labels', async () => {
      const mockResponse = {
        data: {
          id: 'mood-123',
          userId: 'user-123',
          emotionLabels: ['happy', 'grateful'],
          intensity: 7,
          timestamp: '2025-01-15T10:00:00Z',
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      const { isOnline } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(true);
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await moodService.logMood({
        emotionLabels: ['happy', 'grateful'],
        intensity: 7,
      });

      expect(apiClient.post).toHaveBeenCalledWith('/mood/entries', {
        emotionLabels: ['happy', 'grateful'],
        intensity: 7,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should queue mood entry for offline sync when offline', async () => {
      const { isOnline } = require('../../src/services/storage/sync');
      const { queueOfflineAction } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(false);

      await moodService.logMood({
        emotionLabels: ['sad'],
        intensity: 3,
      });

      expect(queueOfflineAction).toHaveBeenCalledWith({
        type: 'mood',
        action: 'create',
        endpoint: '/mood/entries',
        data: {
          emotionLabels: ['sad'],
          intensity: 3,
        },
      });
    });

    it('should handle errors when logging mood', async () => {
      const { apiClient } = require('../../src/services/api/client');
      const { isOnline } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(true);
      apiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        moodService.logMood({
          emotionLabels: ['anxious'],
        }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getMoodEntries', () => {
    it('should fetch mood entries for a user', async () => {
      const mockResponse = {
        data: [
          {
            id: 'mood-123',
            emotionLabels: ['happy'],
            intensity: 7,
            timestamp: '2025-01-15T10:00:00Z',
          },
          {
            id: 'mood-124',
            emotionLabels: ['calm'],
            intensity: 6,
            timestamp: '2025-01-14T10:00:00Z',
          },
        ],
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await moodService.getMoodEntries();

      expect(apiClient.get).toHaveBeenCalledWith('/mood/entries');
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch mood entries with date range', async () => {
      const mockResponse = {
        data: [],
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      await moodService.getMoodEntries({ startDate, endDate });

      expect(apiClient.get).toHaveBeenCalledWith('/mood/entries', {
        params: { startDate, endDate },
      });
    });
  });

  describe('getMoodTrends', () => {
    it('should fetch mood trends for a user', async () => {
      const mockResponse = {
        data: {
          period: 'Weekly',
          trends: [
            {
              periodStart: '2025-01-08',
              periodEnd: '2025-01-14',
              averageMood: 6.5,
              dominantEmotions: ['happy', 'calm'],
              trendDirection: 'Improving',
            },
          ],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await moodService.getMoodTrends('Weekly');

      expect(apiClient.get).toHaveBeenCalledWith('/mood/trends', {
        params: { period: 'Weekly' },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('exportMoodData', () => {
    it('should export mood data as JSON', async () => {
      const mockResponse = {
        data: {
          entries: [
            {
              id: 'mood-123',
              emotionLabels: ['happy'],
              timestamp: '2025-01-15T10:00:00Z',
            },
          ],
          trends: [],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await moodService.exportMoodData();

      expect(apiClient.get).toHaveBeenCalledWith('/mood/export');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

