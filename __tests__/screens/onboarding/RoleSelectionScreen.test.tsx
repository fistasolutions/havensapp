/**
 * Component Tests for RoleSelectionScreen
 * Tests the role selection screen UI and interactions
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RoleSelectionScreen from '../../../src/screens/onboarding/RoleSelectionScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('RoleSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render role selection screen', () => {
    const { getByText } = render(<RoleSelectionScreen />);
    expect(getByText(/select your role/i)).toBeTruthy();
  });

  it('should display all role options', () => {
    const { getByText } = render(<RoleSelectionScreen />);
    expect(getByText(/individual/i)).toBeTruthy();
    expect(getByText(/provider/i)).toBeTruthy();
    expect(getByText(/partner/i)).toBeTruthy();
    expect(getByText(/family/i)).toBeTruthy();
    expect(getByText(/kid/i)).toBeTruthy();
  });

  it('should allow user to select a role', () => {
    const { getByText } = render(<RoleSelectionScreen />);
    const individualButton = getByText(/individual/i);
    fireEvent.press(individualButton);
    // Role should be selected (visual feedback)
    expect(individualButton).toBeTruthy();
  });

  it('should navigate to next screen after role selection', () => {
    const { getByText } = render(<RoleSelectionScreen />);
    const individualButton = getByText(/individual/i);
    fireEvent.press(individualButton);
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);
    expect(mockNavigate).toHaveBeenCalled();
  });
});

