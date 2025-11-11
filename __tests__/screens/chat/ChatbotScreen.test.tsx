/**
 * Component Tests for ChatbotScreen
 * Tests the chatbot screen UI and interactions
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatbotScreen from '../../../src/screens/chat/ChatbotScreen';

// Mock chatbot service
jest.mock('../../../src/services/chatbot/chatbotService', () => ({
  chatbotService: {
    createConversation: jest.fn(),
    sendMessage: jest.fn(),
    getConversations: jest.fn(),
  },
}));

describe('ChatbotScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chatbot screen with initial state', () => {
    const { getByText } = render(<ChatbotScreen />);
    expect(getByText(/chat with ai coach/i)).toBeTruthy();
  });

  it('should display conversation flow selection on first render', () => {
    const { getByText } = render(<ChatbotScreen />);
    expect(getByText(/select a conversation flow/i)).toBeTruthy();
  });

  it('should allow user to select a conversation flow', async () => {
    const { chatbotService } = require('../../../src/services/chatbot/chatbotService');
    chatbotService.createConversation.mockResolvedValue({
      id: 'conv-123',
      conversationFlow: 'AnxietyRelief',
      isActive: true,
    });

    const { getByText } = render(<ChatbotScreen />);
    const anxietyButton = getByText(/anxiety relief/i);

    fireEvent.press(anxietyButton);

    await waitFor(() => {
      expect(chatbotService.createConversation).toHaveBeenCalledWith('AnxietyRelief');
    });
  });

  it('should display chat messages after conversation starts', async () => {
    const { chatbotService } = require('../../../src/services/chatbot/chatbotService');
    chatbotService.createConversation.mockResolvedValue({
      id: 'conv-123',
      conversationFlow: 'AnxietyRelief',
      isActive: true,
    });

    const { getByText, getByPlaceholderText } = render(<ChatbotScreen />);
    const anxietyButton = getByText(/anxiety relief/i);
    fireEvent.press(anxietyButton);

    await waitFor(() => {
      expect(getByPlaceholderText(/type your message/i)).toBeTruthy();
    });
  });

  it('should send message when user types and submits', async () => {
    const { chatbotService } = require('../../../src/services/chatbot/chatbotService');
    chatbotService.createConversation.mockResolvedValue({
      id: 'conv-123',
      conversationFlow: 'AnxietyRelief',
      isActive: true,
    });
    chatbotService.sendMessage.mockResolvedValue({
      message: {
        role: 'assistant',
        content: 'I understand. How can I help you?',
        timestamp: new Date().toISOString(),
      },
      crisisDetected: false,
    });

    const { getByText, getByPlaceholderText } = render(<ChatbotScreen />);
    const anxietyButton = getByText(/anxiety relief/i);
    fireEvent.press(anxietyButton);

    await waitFor(() => {
      const input = getByPlaceholderText(/type your message/i);
      fireEvent.changeText(input, 'I feel anxious');
      fireEvent.press(getByText(/send/i));
    });

    await waitFor(() => {
      expect(chatbotService.sendMessage).toHaveBeenCalledWith('conv-123', 'I feel anxious');
    });
  });

  it('should display crisis resources when crisis is detected', async () => {
    const { chatbotService } = require('../../../src/services/chatbot/chatbotService');
    chatbotService.createConversation.mockResolvedValue({
      id: 'conv-123',
      conversationFlow: 'General',
      isActive: true,
    });
    chatbotService.sendMessage.mockResolvedValue({
      message: {
        role: 'assistant',
        content: 'I am concerned about your safety.',
        timestamp: new Date().toISOString(),
      },
      crisisDetected: true,
      crisisResources: ['Crisis Text Line: Text HOME to 741741'],
    });

    const { getByText, getByPlaceholderText } = render(<ChatbotScreen />);
    const generalButton = getByText(/general/i);
    fireEvent.press(generalButton);

    await waitFor(() => {
      const input = getByPlaceholderText(/type your message/i);
      fireEvent.changeText(input, 'I want to hurt myself');
      fireEvent.press(getByText(/send/i));
    });

    await waitFor(() => {
      expect(getByText(/crisis resources/i)).toBeTruthy();
      expect(getByText(/crisis text line/i)).toBeTruthy();
    });
  });
});

