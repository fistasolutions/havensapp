/**
 * Contract Tests for Exercise API Endpoints
 * Tests API contracts match OpenAPI specification
 */

import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import { generateTokenPair } from '../../../src/utils/jwt';

describe('Exercise API Contract Tests', () => {
  let accessToken: string;
  let userId: string;
  let exerciseId: string;

  beforeAll(async () => {
    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'test@exercise.com',
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

    // Create a test exercise
    const exercise = await prisma.selfHelpExercise.create({
      data: {
        type: 'Breathing',
        title: 'Box Breathing',
        description: 'A calming breathing exercise',
        instructions: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 4 counts'],
        duration: 5,
        evidenceBasedTechnique: 'Mindfulness',
        isActive: true,
      },
    });
    exerciseId = exercise.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: 'test@exercise.com' },
    });
    await prisma.selfHelpExercise.deleteMany({
      where: { id: exerciseId },
    });
  });

  describe('GET /api/v1/exercises', () => {
    it('should return all active exercises', async () => {
      const response = await request(app)
        .get('/api/v1/exercises')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('exercises');
      expect(Array.isArray(response.body.exercises)).toBe(true);
      expect(response.body.exercises.length).toBeGreaterThan(0);
    });

    it('should filter exercises by type', async () => {
      const response = await request(app)
        .get('/api/v1/exercises')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          type: 'Breathing',
        })
        .expect(200);

      expect(response.body).toHaveProperty('exercises');
      expect(response.body.exercises.every((e: any) => e.type === 'Breathing')).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/exercises')
        .expect(401);
    });
  });

  describe('GET /api/v1/exercises/:id', () => {
    it('should return a specific exercise', async () => {
      const response = await request(app)
        .get(`/api/v1/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', exerciseId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('instructions');
    });

    it('should require authentication', async () => {
      await request(app)
        .get(`/api/v1/exercises/${exerciseId}`)
        .expect(401);
    });
  });

  describe('POST /api/v1/exercises/:id/complete', () => {
    it('should mark an exercise as completed', async () => {
      const response = await request(app)
        .post(`/api/v1/exercises/${exerciseId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          duration: 300,
          rating: 5,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('exerciseId', exerciseId);
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('completedAt');
      expect(response.body).toHaveProperty('duration', 300);
      expect(response.body).toHaveProperty('rating', 5);
    });

    it('should validate rating range (1-5)', async () => {
      await request(app)
        .post(`/api/v1/exercises/${exerciseId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rating: 10,
        })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app)
        .post(`/api/v1/exercises/${exerciseId}/complete`)
        .send({
          duration: 300,
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/exercises/progress', () => {
    beforeEach(async () => {
      await prisma.exerciseCompletion.create({
        data: {
          userId,
          exerciseId,
          duration: 300,
          rating: 5,
        },
      });
    });

    afterEach(async () => {
      await prisma.exerciseCompletion.deleteMany({
        where: { userId },
      });
    });

    it('should return user exercise progress', async () => {
      const response = await request(app)
        .get('/api/v1/exercises/progress')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalCompletions');
      expect(response.body).toHaveProperty('exercisesCompleted');
      expect(response.body).toHaveProperty('recentCompletions');
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/exercises/progress')
        .expect(401);
    });
  });
});

