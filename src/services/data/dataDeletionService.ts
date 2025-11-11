/**
 * Data Deletion Service
 * Handles account and data deletion
 */

import { apiClient } from '../api/client';
import { clearTokens } from '../api/client';

class DataDeletionService {
  /**
   * Delete user account and all data
   */
  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete('/user/data');
      // Clear local tokens and data
      await clearTokens();
      // Clear local storage
      const { clearAll } = await import('../storage/localStorage');
      await clearAll();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export const dataDeletionService = new DataDeletionService();

