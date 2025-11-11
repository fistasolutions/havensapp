/**
 * Chatbot Service
 * Business logic for chatbot conversations
 */

import prisma from '../config/database';
import { generateAIResponse, AIMessage } from './aiService';
import { detectCrisis, getCrisisResources } from './crisisDetection';
import { getMoodEntries } from './moodService';

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
 * Get role-specific conversation flow
 */
export const getRoleSpecificFlow = (role: string, defaultFlow: string): string => {
  // Map roles to conversation flows
  const roleFlowMap: Record<string, string> = {
    Kid: 'KidFriendly',
    Provider: 'Professional',
    Partner: 'Couples',
    FamilyFriends: 'GroupSupport',
    Individual: defaultFlow,
  };

  return roleFlowMap[role] || defaultFlow;
};

/**
 * Create a new conversation
 */
export const createConversation = async (data: CreateConversationData) => {
  // Get recent mood data for personalization context
  let personalizationContext: Record<string, unknown> | null = null;
  try {
    const recentMoods = await getMoodEntries({
      userId: data.userId,
      limit: 7, // Last 7 entries
    });

    if (recentMoods.length > 0) {
      const latestMood = recentMoods[0];
      personalizationContext = {
        recentMoods: recentMoods.map((m) => ({
          emotionLabels: m.emotionLabels,
          intensity: m.intensity,
          timestamp: m.timestamp,
        })),
        latestMood: {
          emotionLabels: latestMood.emotionLabels,
          intensity: latestMood.intensity,
        },
      };
    }
  } catch (error) {
    // If mood data fetch fails, continue without context
    console.error('Error fetching mood data for personalization:', error);
  }

  // Get user role for role-specific flow adaptation
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { role: true },
  });

  const adaptedFlow = user
    ? getRoleSpecificFlow(user.role, data.conversationFlow)
    : data.conversationFlow;

  const conversation = await prisma.chatbotConversation.create({
    data: {
      userId: data.userId,
      conversationFlow: adaptedFlow as any,
      messages: [],
      personalizationContext: personalizationContext as any,
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

