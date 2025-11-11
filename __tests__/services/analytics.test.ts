/**
 * Unit Tests for Analytics Service
 * Tests the analytics service functionality
 */

import { analyticsService } from '../../src/services/analytics/analyticsService';

// Mock API client
jest.mock('../../src/services/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

// Mock storage
jest.mock('../../src/services/storage/localStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should track an analytics event', async () => {
      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue({ data: { success: true } });

      await analyticsService.trackEvent('mood_logged', {
        emotionLabels: ['happy'],
        intensity: 5,
      });

      expect(apiClient.post).toHaveBeenCalledWith('/analytics/events', {
        eventType: 'mood_logged',
        properties: {
          emotionLabels: ['happy'],
          intensity: 5,
        },
      });
    });

    it('should queue events when offline', async () => {
      const { getItem, setItem } = require('../../src/services/storage/localStorage');
      getItem.mockResolvedValue(null);

      // Mock offline state
      const { isOnline } = require('../../src/services/storage/sync');
      jest.spyOn(isOnline, 'mockResolvedValue').mockResolvedValue(false);

      await analyticsService.trackEvent('mood_logged', {});

      expect(setItem).toHaveBeenCalled();
    });
  });

  describe('submitFeedback', () => {
    it('should submit user feedback', async () => {
      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue({ data: { id: 'feedback-123' } });

      const result = await analyticsService.submitFeedback({
        sessionType: 'Chatbot',
        rating: 5,
        feedbackText: 'Great experience!',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/feedback', {
        sessionType: 'Chatbot',
        rating: 5,
        feedbackText: 'Great experience!',
      });
      expect(result).toHaveProperty('id', 'feedback-123');
    });
  });

  describe('hasConsent', () => {
    it('should check analytics consent', async () => {
      const { getItem } = require('../../src/services/storage/localStorage');
      getItem.mockResolvedValue(true);

      const hasConsent = await analyticsService.hasConsent();
      expect(hasConsent).toBe(true);
    });
  });
});

