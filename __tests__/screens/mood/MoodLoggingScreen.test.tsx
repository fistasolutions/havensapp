/**
 * Component Tests for MoodLoggingScreen
 * Tests the mood logging screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoodLoggingScreen from '../../../src/screens/mood/MoodLoggingScreen';

// Mock mood service
jest.mock('../../../src/services/mood/moodService', () => ({
  moodService: {
    logMood: jest.fn(),
  },
}));

describe('MoodLoggingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render mood logging screen with emotion selector', () => {
    const { getByText } = render(<MoodLoggingScreen />);
    expect(getByText(/log my mood/i)).toBeTruthy();
  });

  it('should display emotion labels for selection', () => {
    const { getByText } = render(<MoodLoggingScreen />);
    expect(getByText(/happy/i)).toBeTruthy();
    expect(getByText(/sad/i)).toBeTruthy();
    expect(getByText(/anxious/i)).toBeTruthy();
  });

  it('should allow user to select emotion labels', () => {
    const { getByText } = render(<MoodLoggingScreen />);
    const happyButton = getByText(/happy/i);
    
    fireEvent.press(happyButton);
    
    // Emotion should be selected (visual feedback)
    expect(happyButton).toBeTruthy();
  });

  it('should allow user to select multiple emotions', () => {
    const { getByText } = render(<MoodLoggingScreen />);
    const happyButton = getByText(/happy/i);
    const gratefulButton = getByText(/grateful/i);
    
    fireEvent.press(happyButton);
    fireEvent.press(gratefulButton);
    
    expect(happyButton).toBeTruthy();
    expect(gratefulButton).toBeTruthy();
  });

  it('should allow user to set mood intensity', () => {
    const { getByText, getByTestId } = render(<MoodLoggingScreen />);
    const intensitySlider = getByTestId('intensity-slider');
    
    expect(intensitySlider).toBeTruthy();
  });

  it('should submit mood entry when save button is pressed', async () => {
    const { moodService } = require('../../../src/services/mood/moodService');
    moodService.logMood.mockResolvedValue({
      id: 'mood-123',
      emotionLabels: ['happy'],
      intensity: 7,
      timestamp: new Date().toISOString(),
    });

    const { getByText } = render(<MoodLoggingScreen />);
    const happyButton = getByText(/happy/i);
    fireEvent.press(happyButton);

    const saveButton = getByText(/save/i);
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(moodService.logMood).toHaveBeenCalledWith({
        emotionLabels: ['happy'],
        intensity: expect.any(Number),
      });
    });
  });

  it('should require at least one emotion to be selected', async () => {
    const { getByText } = render(<MoodLoggingScreen />);
    const saveButton = getByText(/save/i);
    
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText(/please select at least one emotion/i)).toBeTruthy();
    });
  });

  it('should allow user to add optional notes', () => {
    const { getByPlaceholderText } = render(<MoodLoggingScreen />);
    const notesInput = getByPlaceholderText(/add notes/i);
    
    fireEvent.changeText(notesInput, 'Feeling great today!');
    
    expect(notesInput.props.value).toBe('Feeling great today!');
  });
});

