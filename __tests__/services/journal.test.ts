/**
 * Unit Tests for Journal Service
 * Tests the journal service functionality
 */

import { journalService } from '../../src/services/journal/journalService';

// Mock API client
jest.mock('../../src/services/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock offline sync
jest.mock('../../src/services/storage/sync', () => ({
  isOnline: jest.fn(),
  queueOfflineAction: jest.fn(),
}));

describe('JournalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJournalEntry', () => {
    it('should create a journal entry with prompt and content', async () => {
      const mockResponse = {
        data: {
          id: 'journal-123',
          userId: 'user-123',
          promptId: 'prompt-123',
          content: 'Today I felt grateful for...',
          sentimentScore: 0.7,
          sentimentLabel: 'Positive',
          createdAt: '2025-01-15T10:00:00Z',
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      const { isOnline } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(true);
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await journalService.createJournalEntry({
        promptId: 'prompt-123',
        content: 'Today I felt grateful for...',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/journal/entries', {
        promptId: 'prompt-123',
        content: 'Today I felt grateful for...',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should queue journal entry for offline sync when offline', async () => {
      const { isOnline } = require('../../src/services/storage/sync');
      const { queueOfflineAction } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(false);

      await journalService.createJournalEntry({
        content: 'Today was a challenging day...',
      });

      expect(queueOfflineAction).toHaveBeenCalledWith({
        type: 'journal',
        action: 'create',
        endpoint: '/journal/entries',
        data: {
          content: 'Today was a challenging day...',
        },
      });
    });

    it('should handle errors when creating journal entry', async () => {
      const { apiClient } = require('../../src/services/api/client');
      const { isOnline } = require('../../src/services/storage/sync');
      isOnline.mockResolvedValue(true);
      apiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        journalService.createJournalEntry({
          content: 'Test entry',
        }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getJournalEntries', () => {
    it('should fetch journal entries for a user', async () => {
      const mockResponse = {
        data: {
          entries: [
            {
              id: 'journal-123',
              content: 'Today I felt grateful...',
              sentimentLabel: 'Positive',
              createdAt: '2025-01-15T10:00:00Z',
            },
          ],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await journalService.getJournalEntries();

      expect(apiClient.get).toHaveBeenCalledWith('/journal/entries');
      expect(result).toEqual(mockResponse.data.entries);
    });
  });

  describe('getJournalPrompts', () => {
    it('should fetch personalized journal prompts', async () => {
      const mockResponse = {
        data: {
          prompts: [
            {
              id: 'prompt-123',
              theme: 'Gratitude',
              promptText: 'What are three things you are grateful for today?',
              evidenceBasedTechnique: 'PositivePsychology',
            },
          ],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await journalService.getJournalPrompts();

      expect(apiClient.get).toHaveBeenCalledWith('/journal/prompts');
      expect(result).toEqual(mockResponse.data.prompts);
    });

    it('should fetch prompts personalized by mood', async () => {
      const mockResponse = {
        data: {
          prompts: [],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      await journalService.getJournalPrompts({ moodContext: 'anxious' });

      expect(apiClient.get).toHaveBeenCalledWith('/journal/prompts', {
        params: { moodContext: 'anxious' },
      });
    });
  });

  describe('getJournalEntry', () => {
    it('should fetch a specific journal entry', async () => {
      const mockResponse = {
        data: {
          id: 'journal-123',
          content: 'Today I felt grateful...',
          sentimentScore: 0.7,
          insights: ['You show gratitude regularly'],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await journalService.getJournalEntry('journal-123');

      expect(apiClient.get).toHaveBeenCalledWith('/journal/entries/journal-123');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

