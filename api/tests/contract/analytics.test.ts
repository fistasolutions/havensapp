/**
 * Contract Tests for Analytics API Endpoints
 * Tests API contracts for analytics and feedback collection
 */

import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import { generateTokenPair } from '../../../src/utils/jwt';

describe('Analytics API Contract Tests', () => {
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@analytics.com',
        passwordHash: 'hashed-password',
        role: 'Individual',
        analyticsConsent: true,
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
    await prisma.analyticsEvent.deleteMany({ where: { userId } });
    await prisma.userFeedback.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { email: 'test@analytics.com' } });
  });

  describe('POST /api/v1/analytics/events', () => {
    it('should track an analytics event', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          eventType: 'mood_logged',
          properties: {
            emotionLabels: ['happy'],
            intensity: 5,
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should require analytics consent', async () => {
      // Create user without consent
      const userNoConsent = await prisma.user.create({
        data: {
          email: 'noconsent@test.com',
          passwordHash: 'hashed-password',
          role: 'Individual',
          analyticsConsent: false,
        },
      });

      const tokens = generateTokenPair({
        userId: userNoConsent.id,
        email: userNoConsent.email,
        role: userNoConsent.role,
      });

      await request(app)
        .post('/api/v1/analytics/events')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({
          eventType: 'mood_logged',
          properties: {},
        })
        .expect(403);

      // Cleanup
      await prisma.user.deleteMany({ where: { email: 'noconsent@test.com' } });
    });

    it('should anonymize user data', async () => {
      const response = await request(app)
        .post('/api/v1/analytics/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          eventType: 'feature_used',
          properties: {
            feature: 'journal',
          },
        })
        .expect(201);

      // Verify event was stored with anonymized user ID
      const event = await prisma.analyticsEvent.findFirst({
        where: { userId },
      });

      expect(event).toBeTruthy();
      expect(event?.anonymizedUserId).toBeTruthy();
      expect(event?.anonymizedUserId).not.toBe(userId);
    });
  });

  describe('POST /api/v1/feedback', () => {
    it('should submit user feedback', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sessionType: 'Chatbot',
          rating: 5,
          feedbackText: 'Great experience!',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionType', 'Chatbot');
      expect(response.body).toHaveProperty('rating', 5);
    });

    it('should allow anonymous feedback', async () => {
      const response = await request(app)
        .post('/api/v1/feedback')
        .send({
          sessionType: 'General',
          rating: 4,
          isAnonymous: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('isAnonymous', true);
      expect(response.body.userId).toBeNull();
    });

    it('should validate rating range', async () => {
      await request(app)
        .post('/api/v1/feedback')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sessionType: 'Chatbot',
          rating: 10,
        })
        .expect(400);
    });
  });
});

