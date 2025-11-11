/**
 * Offline Sync Service
 * Handles synchronization of offline data when connectivity is restored
 */

import { apiClient } from '../api/client';
import { getItem, setItem, removeItem } from './localStorage';

const OFFLINE_QUEUE_KEY = '@havensapp:offlineQueue';
const SYNC_IN_PROGRESS_KEY = '@havensapp:syncInProgress';

export interface OfflineAction {
  id: string;
  type: 'mood' | 'journal' | 'chatbot' | 'exercise';
  action: 'create' | 'update' | 'delete';
  endpoint: string;
  data: unknown;
  timestamp: number;
}

/**
 * Add action to offline queue
 */
export const queueOfflineAction = async (
  action: Omit<OfflineAction, 'id' | 'timestamp'>,
): Promise<void> => {
  try {
    const queue = (await getItem<OfflineAction[]>(OFFLINE_QUEUE_KEY)) || [];
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    queue.push(newAction);
    await setItem(OFFLINE_QUEUE_KEY, queue);
  } catch (error) {
    console.error('Error queueing offline action:', error);
    throw error;
  }
};

/**
 * Get offline queue
 */
export const getOfflineQueue = async (): Promise<OfflineAction[]> => {
  try {
    return (await getItem<OfflineAction[]>(OFFLINE_QUEUE_KEY)) || [];
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

/**
 * Clear offline queue
 */
export const clearOfflineQueue = async (): Promise<void> => {
  try {
    await removeItem(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing offline queue:', error);
    throw error;
  }
};

/**
 * Sync offline actions to server
 */
export const syncOfflineActions = async (): Promise<{
  success: number;
  failed: number;
}> => {
  try {
    // Check if sync is already in progress
    const syncInProgress = await getItem<boolean>(SYNC_IN_PROGRESS_KEY);
    if (syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return { success: 0, failed: 0 };
    }

    // Mark sync as in progress
    await setItem(SYNC_IN_PROGRESS_KEY, true);

    const queue = await getOfflineQueue();
    if (queue.length === 0) {
      await removeItem(SYNC_IN_PROGRESS_KEY);
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;
    const remainingActions: OfflineAction[] = [];

    // Process each action in queue
    for (const action of queue) {
      try {
        let response;
        switch (action.action) {
          case 'create':
            // Handle chatbot messages specially
            if (action.type === 'chatbot' && action.endpoint.includes('/messages')) {
              response = await apiClient.post(action.endpoint, action.data);
            } else {
              response = await apiClient.post(action.endpoint, action.data);
            }
            break;
          case 'update':
            response = await apiClient.put(`${action.endpoint}/${action.id}`, action.data);
            break;
          case 'delete':
            response = await apiClient.delete(`${action.endpoint}/${action.id}`);
            break;
        }

        if (response?.status === 200 || response?.status === 201) {
          success++;
        } else {
          failed++;
          remainingActions.push(action);
        }
      } catch (error) {
        console.error(`Error syncing action ${action.id}:`, error);
        failed++;
        remainingActions.push(action);
      }
    }

    // Update queue with remaining actions
    if (remainingActions.length > 0) {
      await setItem(OFFLINE_QUEUE_KEY, remainingActions);
    } else {
      await clearOfflineQueue();
    }

    await removeItem(SYNC_IN_PROGRESS_KEY);
    return { success, failed };
  } catch (error) {
    console.error('Error syncing offline actions:', error);
    await removeItem(SYNC_IN_PROGRESS_KEY);
    throw error;
  }
};

/**
 * Check network connectivity
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    // Simple connectivity check - ping health endpoint
    // Note: This uses the API client which may fail if not authenticated
    // For a more robust check, use NetInfo or a simple fetch
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    // If health check fails, assume offline
    return false;
  }
};

