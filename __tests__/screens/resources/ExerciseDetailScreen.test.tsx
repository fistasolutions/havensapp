/**
 * Component Tests for ExerciseDetailScreen
 * Tests the exercise detail screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExerciseDetailScreen from '../../../src/screens/resources/ExerciseDetailScreen';

// Mock exercise service
jest.mock('../../../src/services/exercises/exerciseService', () => ({
  exerciseService: {
    getExercise: jest.fn(),
    completeExercise: jest.fn(),
  },
}));

describe('ExerciseDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render exercise detail screen', () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercise.mockResolvedValue({
      id: 'exercise-123',
      type: 'Breathing',
      title: 'Box Breathing',
      description: 'A calming breathing exercise',
      instructions: ['Step 1', 'Step 2'],
    });

    const { getByText } = render(<ExerciseDetailScreen exerciseId="exercise-123" />);
    expect(getByText(/box breathing/i)).toBeTruthy();
  });

  it('should display exercise instructions', async () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercise.mockResolvedValue({
      id: 'exercise-123',
      title: 'Box Breathing',
      instructions: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 4 counts'],
    });

    const { getByText } = render(<ExerciseDetailScreen exerciseId="exercise-123" />);

    await waitFor(() => {
      expect(getByText(/breathe in for 4 counts/i)).toBeTruthy();
      expect(getByText(/hold for 4 counts/i)).toBeTruthy();
    });
  });

  it('should allow user to start exercise', () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercise.mockResolvedValue({
      id: 'exercise-123',
      title: 'Box Breathing',
      instructions: [],
    });

    const { getByText } = render(<ExerciseDetailScreen exerciseId="exercise-123" />);
    const startButton = getByText(/start exercise/i);

    expect(startButton).toBeTruthy();
  });

  it('should track exercise completion', async () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercise.mockResolvedValue({
      id: 'exercise-123',
      title: 'Box Breathing',
      instructions: [],
    });
    exerciseService.completeExercise.mockResolvedValue({
      id: 'completion-123',
      completedAt: new Date().toISOString(),
    });

    const { getByText } = render(<ExerciseDetailScreen exerciseId="exercise-123" />);

    await waitFor(() => {
      const completeButton = getByText(/mark as complete/i);
      fireEvent.press(completeButton);
    });

    await waitFor(() => {
      expect(exerciseService.completeExercise).toHaveBeenCalled();
    });
  });
});

