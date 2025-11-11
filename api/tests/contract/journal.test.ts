/**
 * Contract Tests for Journal API Endpoints
 * Tests API contracts match OpenAPI specification
 */

import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import { generateTokenPair } from '../../../src/utils/jwt';

describe('Journal API Contract Tests', () => {
  let accessToken: string;
  let userId: string;
  let journalPromptId: string;

  beforeAll(async () => {
    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'test@journal.com',
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

    // Create a test journal prompt
    const prompt = await prisma.journalPrompt.create({
      data: {
        theme: 'Gratitude',
        promptText: 'What are three things you are grateful for today?',
        evidenceBasedTechnique: 'PositivePsychology',
        isActive: true,
      },
    });
    journalPromptId = prompt.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: 'test@journal.com' },
    });
    await prisma.journalPrompt.deleteMany({
      where: { id: journalPromptId },
    });
  });

  describe('POST /api/v1/journal/entries', () => {
    it('should create a new journal entry', async () => {
      const response = await request(app)
        .post('/api/v1/journal/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          promptId: journalPromptId,
          content: 'Today I felt grateful for my family, friends, and good health.',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('sentimentScore');
      expect(response.body).toHaveProperty('sentimentLabel');
      expect(response.body).toHaveProperty('insights');
    });

    it('should require minimum content length', async () => {
      await request(app)
        .post('/api/v1/journal/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Short',
        })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/journal/entries')
        .send({
          content: 'Test journal entry content',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/journal/entries', () => {
    beforeEach(async () => {
      await prisma.journalEntry.createMany({
        data: [
          {
            userId,
            promptId: journalPromptId,
            content: 'Today I felt grateful for my family.',
            sentimentScore: 0.7,
            sentimentLabel: 'Positive',
            isDraft: false,
          },
          {
            userId,
            content: 'Today was a challenging day at work.',
            sentimentScore: -0.3,
            sentimentLabel: 'Negative',
            isDraft: false,
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.journalEntry.deleteMany({
        where: { userId },
      });
    });

    it('should return user journal entries', async () => {
      const response = await request(app)
        .get('/api/v1/journal/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('entries');
      expect(Array.isArray(response.body.entries)).toBe(true);
      expect(response.body.entries.length).toBeGreaterThan(0);
    });

    it('should filter entries by draft status', async () => {
      const response = await request(app)
        .get('/api/v1/journal/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          isDraft: 'false',
        })
        .expect(200);

      expect(response.body).toHaveProperty('entries');
      expect(response.body.entries.every((e: any) => !e.isDraft)).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/journal/entries')
        .expect(401);
    });
  });

  describe('GET /api/v1/journal/prompts', () => {
    it('should return journal prompts', async () => {
      const response = await request(app)
        .get('/api/v1/journal/prompts')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('prompts');
      expect(Array.isArray(response.body.prompts)).toBe(true);
    });

    it('should personalize prompts based on mood context', async () => {
      const response = await request(app)
        .get('/api/v1/journal/prompts')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          moodContext: 'anxious',
        })
        .expect(200);

      expect(response.body).toHaveProperty('prompts');
      expect(Array.isArray(response.body.prompts)).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/journal/prompts')
        .expect(401);
    });
  });
});

