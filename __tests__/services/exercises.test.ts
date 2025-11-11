/**
 * Unit Tests for Exercise Service
 * Tests the exercise service functionality
 */

import { exerciseService } from '../../src/services/exercises/exerciseService';

// Mock API client
jest.mock('../../src/services/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('ExerciseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should fetch all exercises', async () => {
      const mockResponse = {
        data: {
          exercises: [
            {
              id: 'exercise-123',
              type: 'Breathing',
              title: 'Box Breathing',
              description: 'A calming breathing exercise',
              duration: 5,
            },
          ],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExercises();

      expect(apiClient.get).toHaveBeenCalledWith('/exercises');
      expect(result).toEqual(mockResponse.data.exercises);
    });

    it('should fetch exercises filtered by type', async () => {
      const mockResponse = {
        data: {
          exercises: [],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      await exerciseService.getExercises({ type: 'Breathing' });

      expect(apiClient.get).toHaveBeenCalledWith('/exercises', {
        params: { type: 'Breathing' },
      });
    });
  });

  describe('getExercise', () => {
    it('should fetch a specific exercise', async () => {
      const mockResponse = {
        data: {
          id: 'exercise-123',
          type: 'Breathing',
          title: 'Box Breathing',
          instructions: ['Step 1', 'Step 2'],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExercise('exercise-123');

      expect(apiClient.get).toHaveBeenCalledWith('/exercises/exercise-123');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('completeExercise', () => {
    it('should mark an exercise as completed', async () => {
      const mockResponse = {
        data: {
          id: 'completion-123',
          exerciseId: 'exercise-123',
          completedAt: '2025-01-15T10:00:00Z',
          duration: 300,
          rating: 5,
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await exerciseService.completeExercise('exercise-123', {
        duration: 300,
        rating: 5,
      });

      expect(apiClient.post).toHaveBeenCalledWith('/exercises/exercise-123/complete', {
        duration: 300,
        rating: 5,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getExerciseProgress', () => {
    it('should fetch user exercise progress', async () => {
      const mockResponse = {
        data: {
          totalCompletions: 10,
          exercisesCompleted: 5,
          recentCompletions: [],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await exerciseService.getExerciseProgress();

      expect(apiClient.get).toHaveBeenCalledWith('/exercises/progress');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

