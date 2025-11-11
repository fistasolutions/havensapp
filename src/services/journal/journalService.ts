/**
 * Journal Service
 * Handles journaling API communication and local state management
 */

import { apiClient } from '../api/client';
import { queueOfflineAction, isOnline } from '../storage/sync';
import { getItem, setItem } from '../storage/localStorage';

export interface JournalEntry {
  id: string;
  userId: string;
  promptId?: string;
  promptText?: string;
  content: string;
  sentimentScore?: number;
  sentimentLabel?: 'Positive' | 'Neutral' | 'Negative';
  insights?: string[];
  relatedMoodEntryId?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalPrompt {
  id: string;
  theme: string;
  promptText: string;
  evidenceBasedTechnique: string;
  targetMoodContext?: string[];
}

export interface CreateJournalEntryData {
  promptId?: string;
  content: string;
  relatedMoodEntryId?: string;
}

export interface GetJournalPromptsParams {
  moodContext?: string;
}

const JOURNAL_ENTRIES_CACHE_KEY = '@havensapp:journalEntries';

class JournalService {
  /**
   * Create a journal entry
   */
  async createJournalEntry(data: CreateJournalEntryData): Promise<JournalEntry> {
    try {
      const online = await isOnline();

      if (!online) {
        // Queue for offline sync
        await queueOfflineAction({
          type: 'journal',
          action: 'create',
          endpoint: '/journal/entries',
          data,
        });

        // Create local entry for immediate UI feedback
        const localEntry: JournalEntry = {
          id: `local-${Date.now()}`,
          userId: 'local',
          promptId: data.promptId,
          content: data.content,
          isDraft: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Cache locally
        const cached = await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY) || [];
        cached.push(localEntry);
        await setItem(JOURNAL_ENTRIES_CACHE_KEY, cached);

        return localEntry;
      }

      const response = await apiClient.post<JournalEntry>('/journal/entries', data);

      // Update cache
      const cached = await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY) || [];
      cached.push(response.data);
      await setItem(JOURNAL_ENTRIES_CACHE_KEY, cached);

      return response.data;
    } catch (error) {
      console.error('Error creating journal entry:', error);

      // Retry logic for network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code?: string }).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNABORTED') {
          // Queue for retry
          await queueOfflineAction({
            type: 'journal',
            action: 'create',
            endpoint: '/journal/entries',
            data,
          });

          // Create local entry
          const localEntry: JournalEntry = {
            id: `local-${Date.now()}`,
            userId: 'local',
            promptId: data.promptId,
            content: data.content,
            isDraft: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const cached = await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY) || [];
          cached.push(localEntry);
          await setItem(JOURNAL_ENTRIES_CACHE_KEY, cached);

          return localEntry;
        }
      }

      throw error;
    }
  }

  /**
   * Get journal entries for the current user
   */
  async getJournalEntries(params?: { isDraft?: boolean }): Promise<JournalEntry[]> {
    try {
      const response = await apiClient.get<{ entries: JournalEntry[] }>('/journal/entries', {
        params,
      });

      // Update cache
      await setItem(JOURNAL_ENTRIES_CACHE_KEY, response.data.entries);

      return response.data.entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);

      // Return cached entries if available
      const cached = await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY);
      if (cached) {
        return cached;
      }

      throw error;
    }
  }

  /**
   * Get a specific journal entry
   */
  async getJournalEntry(entryId: string): Promise<JournalEntry> {
    try {
      const response = await apiClient.get<JournalEntry>(`/journal/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      throw error;
    }
  }

  /**
   * Get journal prompts (personalized by mood if provided)
   */
  async getJournalPrompts(params?: GetJournalPromptsParams): Promise<JournalPrompt[]> {
    try {
      const response = await apiClient.get<{ prompts: JournalPrompt[] }>('/journal/prompts', {
        params,
      });

      return response.data.prompts;
    } catch (error) {
      console.error('Error fetching journal prompts:', error);
      throw error;
    }
  }

  /**
   * Update a journal entry
   */
  async updateJournalEntry(entryId: string, data: Partial<CreateJournalEntryData>): Promise<JournalEntry> {
    try {
      const response = await apiClient.put<JournalEntry>(`/journal/entries/${entryId}`, data);

      // Update cache
      const cached = await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY) || [];
      const index = cached.findIndex((e) => e.id === entryId);
      if (index >= 0) {
        cached[index] = response.data;
        await setItem(JOURNAL_ENTRIES_CACHE_KEY, cached);
      }

      return response.data;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }

  /**
   * Get cached journal entries (for offline access)
   */
  async getCachedJournalEntries(): Promise<JournalEntry[]> {
    return (await getItem<JournalEntry[]>(JOURNAL_ENTRIES_CACHE_KEY)) || [];
  }
}

export const journalService = new JournalService();

