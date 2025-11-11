/**
 * Component Tests for JournalEntryScreen
 * Tests the journal entry screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JournalEntryScreen from '../../../src/screens/journal/JournalEntryScreen';

// Mock journal service
jest.mock('../../../src/services/journal/journalService', () => ({
  journalService: {
    createJournalEntry: jest.fn(),
    updateJournalEntry: jest.fn(),
  },
}));

describe('JournalEntryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render journal entry screen with editor', () => {
    const { getByPlaceholderText } = render(<JournalEntryScreen />);
    expect(getByPlaceholderText(/start writing/i)).toBeTruthy();
  });

  it('should display prompt if provided', () => {
    const mockPrompt = {
      id: 'prompt-123',
      promptText: 'What are three things you are grateful for today?',
    };

    const { getByText } = render(<JournalEntryScreen prompt={mockPrompt} />);
    expect(getByText(/what are three things you are grateful for today/i)).toBeTruthy();
  });

  it('should allow user to write journal entry', () => {
    const { getByPlaceholderText } = render(<JournalEntryScreen />);
    const editor = getByPlaceholderText(/start writing/i);

    fireEvent.changeText(editor, 'Today I felt grateful for my family...');

    expect(editor.props.value).toBe('Today I felt grateful for my family...');
  });

  it('should save journal entry when save button is pressed', async () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.createJournalEntry.mockResolvedValue({
      id: 'entry-123',
      content: 'Today I felt grateful...',
      sentimentScore: 0.7,
      sentimentLabel: 'Positive',
    });

    const { getByPlaceholderText, getByText } = render(<JournalEntryScreen />);
    const editor = getByPlaceholderText(/start writing/i);
    fireEvent.changeText(editor, 'Today I felt grateful...');

    const saveButton = getByText(/save/i);
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(journalService.createJournalEntry).toHaveBeenCalledWith({
        content: 'Today I felt grateful...',
      });
    });
  });

  it('should require minimum content length', async () => {
    const { getByText } = render(<JournalEntryScreen />);
    const saveButton = getByText(/save/i);

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText(/please write at least/i)).toBeTruthy();
    });
  });

  it('should show sentiment analysis after saving', async () => {
    const { journalService } = require('../../../src/services/journal/journalService');
    journalService.createJournalEntry.mockResolvedValue({
      id: 'entry-123',
      content: 'Today I felt grateful...',
      sentimentScore: 0.7,
      sentimentLabel: 'Positive',
      insights: ['You show gratitude regularly'],
    });

    const { getByPlaceholderText, getByText } = render(<JournalEntryScreen />);
    const editor = getByPlaceholderText(/start writing/i);
    fireEvent.changeText(editor, 'Today I felt grateful for my family and friends...');

    const saveButton = getByText(/save/i);
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText(/positive/i)).toBeTruthy();
      expect(getByText(/you show gratitude regularly/i)).toBeTruthy();
    });
  });
});

