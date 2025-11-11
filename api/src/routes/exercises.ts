/**
 * Exercise Routes
 * API routes for self-help exercise functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getExercisesHandler,
  getExerciseHandler,
  completeExerciseHandler,
  getExerciseProgressHandler,
} from '../controllers/exerciseController';

const router = Router();

// All exercise routes require authentication
router.use(authenticateToken);

// GET /exercises - Get exercises (optionally filtered by type)
router.get('/', getExercisesHandler);

// GET /exercises/progress - Get user exercise progress
router.get('/progress', getExerciseProgressHandler);

// GET /exercises/:id - Get specific exercise
router.get('/:id', getExerciseHandler);

// POST /exercises/:id/complete - Mark exercise as completed
router.post('/:id/complete', completeExerciseHandler);

export default router;

