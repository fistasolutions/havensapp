/**
 * Unit Tests for Chatbot Service
 * Tests the chatbot service functionality
 */

import { chatbotService } from '../../src/services/chatbot/chatbotService';

// Mock API client
jest.mock('../../src/services/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('ChatbotService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createConversation', () => {
    it('should create a new conversation with selected flow', async () => {
      const mockResponse = {
        data: {
          id: 'conv-123',
          conversationFlow: 'AnxietyRelief',
          isActive: true,
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatbotService.createConversation('AnxietyRelief');

      expect(apiClient.post).toHaveBeenCalledWith('/chatbot/conversations', {
        conversationFlow: 'AnxietyRelief',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating conversation', async () => {
      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        chatbotService.createConversation('AnxietyRelief'),
      ).rejects.toThrow('Network error');
    });
  });

  describe('sendMessage', () => {
    it('should send a message and receive AI response', async () => {
      const mockResponse = {
        data: {
          message: {
            role: 'assistant',
            content: 'I understand you are feeling anxious. Let me help you.',
            timestamp: new Date().toISOString(),
          },
          crisisDetected: false,
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatbotService.sendMessage('conv-123', 'I feel anxious');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/chatbot/conversations/conv-123/messages',
        { content: 'I feel anxious' },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle crisis detection', async () => {
      const mockResponse = {
        data: {
          message: {
            role: 'assistant',
            content: 'I am concerned about your safety. Please reach out for help.',
            timestamp: new Date().toISOString(),
          },
          crisisDetected: true,
          crisisResources: ['Crisis Text Line', '988 Suicide & Crisis Lifeline'],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatbotService.sendMessage('conv-123', 'I want to hurt myself');

      expect(result.crisisDetected).toBe(true);
      expect(result.crisisResources).toBeDefined();
    });
  });

  describe('getConversations', () => {
    it('should fetch user conversations', async () => {
      const mockResponse = {
        data: {
          conversations: [
            {
              id: 'conv-123',
              conversationFlow: 'AnxietyRelief',
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      };

      const { apiClient } = require('../../src/services/api/client');
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chatbotService.getConversations();

      expect(apiClient.get).toHaveBeenCalledWith('/chatbot/conversations');
      expect(result).toEqual(mockResponse.data.conversations);
    });
  });
});

