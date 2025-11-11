/**
 * Data Export Service
 * Handles exporting all user data
 */

import { apiClient } from '../api/client';

export interface ExportedData {
  profile: any;
  moodEntries: any[];
  moodTrends: any[];
  journalEntries: any[];
  chatbotConversations: any[];
  exerciseCompletions: any[];
  feedback: any[];
  exportedAt: string;
}

class DataExportService {
  /**
   * Export all user data
   */
  async exportAllData(): Promise<ExportedData> {
    try {
      const response = await apiClient.get<ExportedData>('/user/data/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

export const dataExportService = new DataExportService();

