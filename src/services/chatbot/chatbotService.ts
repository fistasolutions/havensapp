/**
 * Chatbot Service
 * Handles chatbot API communication and local state management
 */

import { apiClient } from '../api/client';
import { queueOfflineAction } from '../storage/sync';
import { isOnline } from '../storage/sync';

export interface ChatbotConversation {
  id: string;
  userId: string;
  conversationFlow: string;
  messages: ChatbotMessage[];
  crisisDetected: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface SendMessageResponse {
  message: ChatbotMessage;
  crisisDetected: boolean;
  crisisResources?: string[];
}

export interface CreateConversationResponse {
  id: string;
  conversationFlow: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
}

class ChatbotService {
  /**
   * Create a new conversation
   */
  async createConversation(
    conversationFlow: string,
  ): Promise<CreateConversationResponse> {
    try {
      const online = await isOnline();
      if (!online) {
        throw new Error('Offline - conversation creation requires internet');
      }

      const response = await apiClient.post<CreateConversationResponse>(
        '/chatbot/conversations',
        { conversationFlow },
      );

      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<SendMessageResponse> {
    try {
      const online = await isOnline();

      if (!online) {
        // Queue message for offline sync
        await queueOfflineAction({
          type: 'chatbot',
          action: 'create',
          endpoint: `/chatbot/conversations/${conversationId}/messages`,
          data: { content },
        });

        // Return a placeholder response for offline mode
        return {
          message: {
            role: 'assistant',
            content:
              'You are offline. Your message will be sent when you reconnect.',
            timestamp: new Date().toISOString(),
          },
          crisisDetected: false,
        };
      }

      const response = await apiClient.post<SendMessageResponse>(
        `/chatbot/conversations/${conversationId}/messages`,
        { content },
      );

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Retry logic for network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code?: string }).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNABORTED') {
          // Queue for retry
          await queueOfflineAction({
            type: 'chatbot',
            action: 'create',
            endpoint: `/chatbot/conversations/${conversationId}/messages`,
            data: { content },
          });
          
          return {
            message: {
              role: 'assistant',
              content: 'Network error. Your message will be sent when connection is restored.',
              timestamp: new Date().toISOString(),
            },
            crisisDetected: false,
          };
        }
      }
      
      throw error;
    }
  }

  /**
   * Get user conversations
   */
  async getConversations(): Promise<ChatbotConversation[]> {
    try {
      const response = await apiClient.get<{ conversations: ChatbotConversation[] }>(
        '/chatbot/conversations',
      );

      return response.data.conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationId: string): Promise<ChatbotConversation> {
    try {
      const response = await apiClient.get<ChatbotConversation>(
        `/chatbot/conversations/${conversationId}`,
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }
}

export const chatbotService = new ChatbotService();

