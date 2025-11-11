/**
 * Component Tests for SelfHelpResourcesScreen
 * Tests the self-help resources screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SelfHelpResourcesScreen from '../../../src/screens/resources/SelfHelpResourcesScreen';

// Mock exercise service
jest.mock('../../../src/services/exercises/exerciseService', () => ({
  exerciseService: {
    getExercises: jest.fn(),
  },
}));

describe('SelfHelpResourcesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render self-help resources screen', () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercises.mockResolvedValue([]);

    const { getByText } = render(<SelfHelpResourcesScreen />);
    expect(getByText(/self-help resources/i)).toBeTruthy();
  });

  it('should display exercise categories', async () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercises.mockResolvedValue([
      {
        id: 'exercise-123',
        type: 'Breathing',
        title: 'Box Breathing',
        description: 'A calming breathing exercise',
      },
      {
        id: 'exercise-124',
        type: 'Mindfulness',
        title: 'Body Scan',
        description: 'A mindfulness exercise',
      },
    ]);

    const { getByText } = render(<SelfHelpResourcesScreen />);

    await waitFor(() => {
      expect(getByText(/breathing/i)).toBeTruthy();
      expect(getByText(/mindfulness/i)).toBeTruthy();
    });
  });

  it('should allow user to select an exercise', async () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercises.mockResolvedValue([
      {
        id: 'exercise-123',
        type: 'Breathing',
        title: 'Box Breathing',
        description: 'A calming breathing exercise',
      },
    ]);

    const { getByText } = render(<SelfHelpResourcesScreen />);

    await waitFor(() => {
      const exerciseCard = getByText(/box breathing/i);
      fireEvent.press(exerciseCard);
    });
  });

  it('should filter exercises by category', async () => {
    const { exerciseService } = require('../../../src/services/exercises/exerciseService');
    exerciseService.getExercises.mockResolvedValue([
      {
        id: 'exercise-123',
        type: 'Breathing',
        title: 'Box Breathing',
      },
    ]);

    const { getByText } = render(<SelfHelpResourcesScreen />);

    await waitFor(() => {
      const breathingButton = getByText(/breathing/i);
      fireEvent.press(breathingButton);
    });
  });
});

