/**
 * Chatbot Controller
 * Request handlers for chatbot endpoints
 */

import { Request, Response } from 'express';
import {
  createConversation,
  sendMessage,
  getUserConversations,
  getConversation,
} from '../services/chatbotService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * POST /chatbot/conversations
 * Create a new conversation
 */
export const createConversationHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { conversationFlow } = req.body;

    if (!conversationFlow) {
      throw new ApplicationError('conversationFlow is required', 400);
    }

    const validFlows = [
      'AnxietyRelief',
      'StressManagement',
      'DepressionSupport',
      'General',
      'Custom',
    ];
    if (!validFlows.includes(conversationFlow)) {
      throw new ApplicationError('Invalid conversationFlow', 400);
    }

    const conversation = await createConversation({
      userId,
      conversationFlow,
    });

    res.status(201).json({
      id: conversation.id,
      conversationFlow: conversation.conversationFlow,
      isActive: conversation.isActive,
      userId: conversation.userId,
      createdAt: conversation.createdAt,
    });
  },
);

/**
 * POST /chatbot/conversations/:id/messages
 * Send a message in a conversation
 */
export const sendMessageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new ApplicationError('Message content is required', 400);
    }

    const result = await sendMessage({
      conversationId,
      userId,
      content: content.trim(),
    });

    res.json({
      message: result.message,
      crisisDetected: result.crisisDetected,
      crisisResources: result.crisisResources,
    });
  },
);

/**
 * GET /chatbot/conversations
 * Get user conversations
 */
export const getConversationsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const conversations = await getUserConversations(userId);

    res.json({
      conversations: conversations.map((conv) => ({
        id: conv.id,
        userId: conv.userId,
        conversationFlow: conv.conversationFlow,
        messages: conv.messages,
        crisisDetected: conv.crisisDetected,
        isActive: conv.isActive,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      })),
    });
  },
);

/**
 * GET /chatbot/conversations/:id
 * Get a specific conversation
 */
export const getConversationHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { conversationId } = req.params;

    const conversation = await getConversation(conversationId, userId);

    res.json({
      id: conversation.id,
      userId: conversation.userId,
      conversationFlow: conversation.conversationFlow,
      messages: conversation.messages,
      crisisDetected: conversation.crisisDetected,
      isActive: conversation.isActive,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  },
);

