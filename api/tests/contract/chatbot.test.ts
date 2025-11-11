/**
 * Contract Tests for Chatbot API Endpoints
 * Tests API contracts match OpenAPI specification
 */

import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import { generateTokenPair } from '../../../src/utils/jwt';

describe('Chatbot API Contract Tests', () => {
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'test@chatbot.com',
        passwordHash: 'hashed-password',
        role: 'Individual',
      },
    });
    userId = user.id;

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    accessToken = tokens.accessToken;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: 'test@chatbot.com' },
    });
  });

  describe('POST /api/v1/chatbot/conversations', () => {
    it('should create a new conversation', async () => {
      const response = await request(app)
        .post('/api/v1/chatbot/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          conversationFlow: 'AnxietyRelief',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('conversationFlow', 'AnxietyRelief');
      expect(response.body).toHaveProperty('isActive', true);
      expect(response.body).toHaveProperty('userId', userId);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/chatbot/conversations')
        .send({
          conversationFlow: 'AnxietyRelief',
        })
        .expect(401);
    });

    it('should validate conversation flow enum', async () => {
      await request(app)
        .post('/api/v1/chatbot/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          conversationFlow: 'InvalidFlow',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/chatbot/conversations/:id/messages', () => {
    let conversationId: string;

    beforeEach(async () => {
      const conversation = await prisma.chatbotConversation.create({
        data: {
          userId,
          conversationFlow: 'AnxietyRelief',
          messages: [],
          crisisDetected: false,
          crisisResourcesProvided: false,
          isActive: true,
        },
      });
      conversationId = conversation.id;
    });

    afterEach(async () => {
      await prisma.chatbotConversation.deleteMany({
        where: { userId },
      });
    });

    it('should send message and receive AI response', async () => {
      const response = await request(app)
        .post(`/api/v1/chatbot/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'I feel anxious about my upcoming presentation',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toHaveProperty('role', 'assistant');
      expect(response.body.message).toHaveProperty('content');
      expect(response.body.message).toHaveProperty('timestamp');
    });

    it('should detect crisis language', async () => {
      const response = await request(app)
        .post(`/api/v1/chatbot/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'I want to hurt myself',
        })
        .expect(200);

      expect(response.body).toHaveProperty('crisisDetected', true);
      expect(response.body).toHaveProperty('crisisResources');
    });

    it('should require message content', async () => {
      await request(app)
        .post(`/api/v1/chatbot/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/v1/chatbot/conversations', () => {
    beforeEach(async () => {
      await prisma.chatbotConversation.createMany({
        data: [
          {
            userId,
            conversationFlow: 'AnxietyRelief',
            messages: [],
            crisisDetected: false,
            crisisResourcesProvided: false,
            isActive: true,
          },
          {
            userId,
            conversationFlow: 'StressManagement',
            messages: [],
            crisisDetected: false,
            crisisResourcesProvided: false,
            isActive: false,
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.chatbotConversation.deleteMany({
        where: { userId },
      });
    });

    it('should return user conversations', async () => {
      const response = await request(app)
        .get('/api/v1/chatbot/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('conversations');
      expect(Array.isArray(response.body.conversations)).toBe(true);
      expect(response.body.conversations.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/chatbot/conversations')
        .expect(401);
    });
  });
});

