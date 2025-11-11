/**
 * Contract Tests for Mood API Endpoints
 * Tests API contracts match OpenAPI specification
 */

import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import { generateTokenPair } from '../../../src/utils/jwt';

describe('Mood API Contract Tests', () => {
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'test@mood.com',
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
      where: { email: 'test@mood.com' },
    });
  });

  describe('POST /api/v1/mood/entries', () => {
    it('should create a new mood entry', async () => {
      const response = await request(app)
        .post('/api/v1/mood/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          emotionLabels: ['happy', 'grateful'],
          intensity: 7,
          notes: 'Feeling great today!',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('emotionLabels');
      expect(Array.isArray(response.body.emotionLabels)).toBe(true);
      expect(response.body.emotionLabels).toContain('happy');
      expect(response.body.emotionLabels).toContain('grateful');
      expect(response.body).toHaveProperty('intensity', 7);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should require at least one emotion label', async () => {
      await request(app)
        .post('/api/v1/mood/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          intensity: 7,
        })
        .expect(400);
    });

    it('should validate intensity range (1-10)', async () => {
      await request(app)
        .post('/api/v1/mood/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          emotionLabels: ['happy'],
          intensity: 15,
        })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/mood/entries')
        .send({
          emotionLabels: ['happy'],
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/mood/entries', () => {
    beforeEach(async () => {
      await prisma.moodEntry.createMany({
        data: [
          {
            userId,
            emotionLabels: ['happy'],
            intensity: 7,
            timestamp: new Date('2025-01-15'),
          },
          {
            userId,
            emotionLabels: ['calm'],
            intensity: 6,
            timestamp: new Date('2025-01-14'),
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.moodEntry.deleteMany({
        where: { userId },
      });
    });

    it('should return user mood entries', async () => {
      const response = await request(app)
        .get('/api/v1/mood/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('entries');
      expect(Array.isArray(response.body.entries)).toBe(true);
      expect(response.body.entries.length).toBeGreaterThan(0);
    });

    it('should filter entries by date range', async () => {
      const response = await request(app)
        .get('/api/v1/mood/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          startDate: '2025-01-14',
          endDate: '2025-01-15',
        })
        .expect(200);

      expect(response.body).toHaveProperty('entries');
      expect(Array.isArray(response.body.entries)).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/mood/entries')
        .expect(401);
    });
  });

  describe('GET /api/v1/mood/trends', () => {
    beforeEach(async () => {
      // Create mood entries for trend calculation
      await prisma.moodEntry.createMany({
        data: [
          {
            userId,
            emotionLabels: ['happy'],
            intensity: 7,
            timestamp: new Date('2025-01-15'),
          },
          {
            userId,
            emotionLabels: ['calm'],
            intensity: 6,
            timestamp: new Date('2025-01-14'),
          },
          {
            userId,
            emotionLabels: ['happy'],
            intensity: 8,
            timestamp: new Date('2025-01-13'),
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.moodEntry.deleteMany({
        where: { userId },
      });
      await prisma.moodTrend.deleteMany({
        where: { userId },
      });
    });

    it('should return mood trends for weekly period', async () => {
      const response = await request(app)
        .get('/api/v1/mood/trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          period: 'Weekly',
        })
        .expect(200);

      expect(response.body).toHaveProperty('period', 'Weekly');
      expect(response.body).toHaveProperty('trends');
      expect(Array.isArray(response.body.trends)).toBe(true);
    });

    it('should return mood trends for monthly period', async () => {
      const response = await request(app)
        .get('/api/v1/mood/trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          period: 'Monthly',
        })
        .expect(200);

      expect(response.body).toHaveProperty('period', 'Monthly');
      expect(response.body).toHaveProperty('trends');
    });

    it('should validate period enum', async () => {
      await request(app)
        .get('/api/v1/mood/trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          period: 'InvalidPeriod',
        })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/mood/trends')
        .expect(401);
    });
  });
});

