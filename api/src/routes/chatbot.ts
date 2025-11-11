/**
 * Chatbot Routes
 * API routes for chatbot functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createConversationHandler,
  sendMessageHandler,
  getConversationsHandler,
  getConversationHandler,
} from '../controllers/chatbotController';

const router = Router();

// All chatbot routes require authentication
router.use(authenticateToken);

// POST /chatbot/conversations - Create new conversation
router.post('/conversations', createConversationHandler);

// GET /chatbot/conversations - Get user conversations
router.get('/conversations', getConversationsHandler);

// GET /chatbot/conversations/:id - Get specific conversation
router.get('/conversations/:id', getConversationHandler);

// POST /chatbot/conversations/:id/messages - Send message
router.post('/conversations/:id/messages', sendMessageHandler);

export default router;

