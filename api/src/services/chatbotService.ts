/**
 * Chatbot Service
 * Business logic for chatbot conversations
 */

import prisma from '../config/database';
import { generateAIResponse, AIMessage } from './aiService';
import { detectCrisis, getCrisisResources } from './crisisDetection';

export interface ChatbotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface CreateConversationData {
  userId: string;
  conversationFlow: string;
}

export interface SendMessageData {
  conversationId: string;
  userId: string;
  content: string;
}

/**
 * Create a new conversation
 */
export const createConversation = async (data: CreateConversationData) => {
  const conversation = await prisma.chatbotConversation.create({
    data: {
      userId: data.userId,
      conversationFlow: data.conversationFlow as any,
      messages: [],
      personalizationContext: null,
      crisisDetected: false,
      crisisResourcesProvided: false,
      isActive: true,
    },
  });

  return conversation;
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (data: SendMessageData) => {
  // Get conversation
  const conversation = await prisma.chatbotConversation.findUnique({
    where: { id: data.conversationId },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (conversation.userId !== data.userId) {
    throw new Error('Unauthorized');
  }

  // Get existing messages
  const existingMessages = (conversation.messages as unknown as ChatbotMessage[]) || [];

  // Add user message
  const userMessage: ChatbotMessage = {
    role: 'user',
    content: data.content,
    timestamp: new Date().toISOString(),
  };

  const updatedMessages = [...existingMessages, userMessage];

  // Detect crisis
  const crisisDetection = detectCrisis(data.content);
  let crisisResources: string[] = [];

  if (crisisDetection.detected && !conversation.crisisResourcesProvided) {
    crisisResources = getCrisisResources().map(
      (r) => `${r.name}: ${r.text || r.phone}`,
    );
  }

  // Generate AI response
  const aiMessages: AIMessage[] = updatedMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const aiResponse = await generateAIResponse(
    aiMessages,
    conversation.conversationFlow,
    conversation.personalizationContext as Record<string, unknown> | undefined,
  );

  // Add assistant message
  const assistantMessage: ChatbotMessage = {
    role: 'assistant',
    content: aiResponse.content,
    timestamp: new Date().toISOString(),
  };

  const finalMessages = [...updatedMessages, assistantMessage];

  // Update conversation
  const updatedConversation = await prisma.chatbotConversation.update({
    where: { id: data.conversationId },
    data: {
      messages: finalMessages as any,
      crisisDetected: crisisDetection.detected || conversation.crisisDetected,
      crisisResourcesProvided:
        crisisDetection.detected || conversation.crisisResourcesProvided,
      updatedAt: new Date(),
    },
  });

  return {
    message: assistantMessage,
    crisisDetected: crisisDetection.detected,
    crisisResources: crisisResources.length > 0 ? crisisResources : undefined,
  };
};

/**
 * Get user conversations
 */
export const getUserConversations = async (userId: string) => {
  const conversations = await prisma.chatbotConversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      conversationFlow: true,
      messages: true,
      crisisDetected: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return conversations;
};

/**
 * Get a specific conversation
 */
export const getConversation = async (conversationId: string, userId: string) => {
  const conversation = await prisma.chatbotConversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
};

