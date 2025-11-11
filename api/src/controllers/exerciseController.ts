/**
 * Exercise Controller
 * Request handlers for exercise endpoints
 */

import { Request, Response } from 'express';
import {
  getExercises,
  getExercise,
  completeExercise,
  getExerciseProgress,
} from '../services/exerciseService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * GET /exercises
 * Get exercises (optionally filtered by type)
 */
export const getExercisesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { type } = req.query;

    const exercises = await getExercises({
      userId,
      type: type as string | undefined,
    });

    res.json({
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        type: exercise.type,
        title: exercise.title,
        description: exercise.description,
        instructions: exercise.instructions,
        duration: exercise.duration,
        evidenceBasedTechnique: exercise.evidenceBasedTechnique,
      })),
    });
  },
);

/**
 * GET /exercises/:id
 * Get a specific exercise
 */
export const getExerciseHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { id } = req.params;

    const exercise = await getExercise(id);

    res.json({
      id: exercise.id,
      type: exercise.type,
      title: exercise.title,
      description: exercise.description,
      instructions: exercise.instructions,
      duration: exercise.duration,
      evidenceBasedTechnique: exercise.evidenceBasedTechnique,
    });
  },
);

/**
 * POST /exercises/:id/complete
 * Mark an exercise as completed
 */
export const completeExerciseHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { duration, rating } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ApplicationError('Rating must be between 1 and 5', 400);
    }

    const completion = await completeExercise({
      userId,
      exerciseId: id,
      duration,
      rating,
    });

    res.status(201).json({
      id: completion.id,
      exerciseId: completion.exerciseId,
      userId: completion.userId,
      completedAt: completion.completedAt,
      duration: completion.duration,
      rating: completion.rating,
    });
  },
);

/**
 * GET /exercises/progress
 * Get user exercise progress
 */
export const getExerciseProgressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const progress = await getExerciseProgress({ userId });

    res.json(progress);
  },
);

