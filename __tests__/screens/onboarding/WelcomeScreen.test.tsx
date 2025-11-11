/**
 * Component Tests for WelcomeScreen
 * Tests the welcome/onboarding screen UI and interactions
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../../../src/screens/onboarding/WelcomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome screen', () => {
    const { getByText } = render(<WelcomeScreen />);
    expect(getByText(/welcome/i)).toBeTruthy();
  });

  it('should display app description', () => {
    const { getByText } = render(<WelcomeScreen />);
    expect(getByText(/mental health/i)).toBeTruthy();
  });

  it('should have a "Get Started" button', () => {
    const { getByText } = render(<WelcomeScreen />);
    const button = getByText(/get started/i);
    expect(button).toBeTruthy();
  });

  it('should navigate to role selection on button press', () => {
    const { getByText } = render(<WelcomeScreen />);
    const button = getByText(/get started/i);
    fireEvent.press(button);
    expect(mockNavigate).toHaveBeenCalledWith('RoleSelection');
  });
});

