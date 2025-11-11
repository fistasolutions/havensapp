/**
 * Component Tests for MoodTrendsScreen
 * Tests the mood trends screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoodTrendsScreen from '../../../src/screens/mood/MoodTrendsScreen';

// Mock mood service
jest.mock('../../../src/services/mood/moodService', () => ({
  moodService: {
    getMoodTrends: jest.fn(),
    getMoodEntries: jest.fn(),
  },
}));

describe('MoodTrendsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render mood trends screen', () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
      period: 'Weekly',
      trends: [],
    });

    const { getByText } = render(<MoodTrendsScreen />);
    expect(getByText(/mood trends/i)).toBeTruthy();
  });

  it('should display mood trend chart', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
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
    });

    const { getByTestId } = render(<MoodTrendsScreen />);

    await waitFor(() => {
      const chart = getByTestId('mood-trend-chart');
      expect(chart).toBeTruthy();
    });
  });

  it('should allow user to switch between Daily, Weekly, and Monthly views', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
      period: 'Weekly',
      trends: [],
    });

    const { getByText } = render(<MoodTrendsScreen />);
    
    const weeklyButton = getByText(/weekly/i);
    const monthlyButton = getByText(/monthly/i);
    
    fireEvent.press(monthlyButton);

    await waitFor(() => {
      expect(moodService.getMoodTrends).toHaveBeenCalledWith('Monthly');
    });
  });

  it('should display trend direction indicator', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
      period: 'Weekly',
      trends: [
        {
          periodStart: '2025-01-08',
          periodEnd: '2025-01-14',
          averageMood: 6.5,
          dominantEmotions: ['happy'],
          trendDirection: 'Improving',
        },
      ],
    });

    const { getByText } = render(<MoodTrendsScreen />);

    await waitFor(() => {
      expect(getByText(/improving/i)).toBeTruthy();
    });
  });

  it('should display dominant emotions for each period', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
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
    });

    const { getByText } = render(<MoodTrendsScreen />);

    await waitFor(() => {
      expect(getByText(/happy/i)).toBeTruthy();
      expect(getByText(/calm/i)).toBeTruthy();
    });
  });

  it('should handle empty trends gracefully', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.getMoodTrends.mockResolvedValue({
      period: 'Weekly',
      trends: [],
    });

    const { getByText } = render(<MoodTrendsScreen />);

    await waitFor(() => {
      expect(getByText(/no mood data yet/i)).toBeTruthy();
    });
  });
});

