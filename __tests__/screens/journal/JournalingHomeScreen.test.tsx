/**
 * Component Tests for JournalingHomeScreen
 * Tests the journaling home screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JournalingHomeScreen from '../../../src/screens/journal/JournalingHomeScreen';

// Mock journal service
jest.mock('../../../src/services/journal/journalService', () => ({
  journalService: {
    getJournalPrompts: jest.fn(),
    getJournalEntries: jest.fn(),
  },
}));

describe('JournalingHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render journaling home screen', () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.getJournalPrompts.mockResolvedValue([]);
    journalService.getJournalEntries.mockResolvedValue([]);

    const { getByText } = render(<JournalingHomeScreen />);
    expect(getByText(/journaling/i)).toBeTruthy();
  });

  it('should display personalized prompts', async () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.getJournalPrompts.mockResolvedValue([
      {
        id: 'prompt-123',
        theme: 'Gratitude',
        promptText: 'What are three things you are grateful for today?',
        evidenceBasedTechnique: 'PositivePsychology',
      },
    ]);
    journalService.getJournalEntries.mockResolvedValue([]);

    const { getByText } = render(<JournalingHomeScreen />);

    await waitFor(() => {
      expect(getByText(/what are three things you are grateful for today/i)).toBeTruthy();
    });
  });

  it('should allow user to select a prompt', async () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    const mockPrompt = {
      id: 'prompt-123',
      theme: 'Gratitude',
      promptText: 'What are three things you are grateful for today?',
      evidenceBasedTechnique: 'PositivePsychology',
    };
    journalService.getJournalPrompts.mockResolvedValue([mockPrompt]);
    journalService.getJournalEntries.mockResolvedValue([]);

    const { getByText } = render(<JournalingHomeScreen />);

    await waitFor(() => {
      const promptCard = getByText(/what are three things you are grateful for today/i);
      fireEvent.press(promptCard);
    });
  });

  it('should display recent journal entries', async () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.getJournalPrompts.mockResolvedValue([]);
    journalService.getJournalEntries.mockResolvedValue([
      {
        id: 'entry-123',
        content: 'Today I felt grateful...',
        createdAt: '2025-01-15T10:00:00Z',
      },
    ]);

    const { getByText } = render(<JournalingHomeScreen />);

    await waitFor(() => {
      expect(getByText(/today i felt grateful/i)).toBeTruthy();
    });
  });

  it('should allow user to start new entry without prompt', () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.getJournalPrompts.mockResolvedValue([]);
    journalService.getJournalEntries.mockResolvedValue([]);

    const { getByText } = render(<JournalingHomeScreen />);
    const newEntryButton = getByText(/start new entry/i);

    expect(newEntryButton).toBeTruthy();
  });
});

