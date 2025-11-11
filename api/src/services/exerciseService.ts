/**
 * Exercise Service
 * Business logic for self-help exercises
 */

import prisma from '../config/database';
import { getMoodEntries } from './moodService';

export interface GetExercisesParams {
  userId: string;
  type?: string;
}

export interface CompleteExerciseData {
  userId: string;
  exerciseId: string;
  duration?: number;
  rating?: number;
}

export interface GetExerciseProgressParams {
  userId: string;
}

/**
 * Get exercises (optionally filtered by type and personalized by mood)
 */
export const getExercises = async (params: GetExercisesParams) => {
  const where: any = {
    isActive: true,
  };

  if (params.type) {
    where.type = params.type;
  }

  // Get recent mood to personalize recommendations
  let recommendedExercises: any[] = [];
  try {
    const recentMoods = await getMoodEntries({
      userId: params.userId,
      limit: 3,
    });

    if (recentMoods.length > 0) {
      const latestMood = recentMoods[0];
      const dominantEmotion = latestMood.emotionLabels[0];

      // Map emotions to exercise types
      const emotionToExerciseType: Record<string, string> = {
        anxious: 'Breathing',
        stressed: 'Breathing',
        overwhelmed: 'Breathing',
        worried: 'Breathing',
        sad: 'Mindfulness',
        angry: 'DistressTolerance',
        frustrated: 'DistressTolerance',
        lonely: 'Mindfulness',
      };

      const recommendedType = emotionToExerciseType[dominantEmotion.toLowerCase()];
      if (recommendedType) {
        const recommended = await prisma.selfHelpExercise.findMany({
          where: {
            ...where,
            type: recommendedType as any,
          },
          take: 3,
        });
        recommendedExercises = recommended;
      }
    }
  } catch (error) {
    // If mood fetch fails, continue without personalization
    console.error('Error fetching mood for exercise personalization:', error);
  }

  // Get all exercises matching the filter
  const allExercises = await prisma.selfHelpExercise.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Prioritize recommended exercises
  const recommendedIds = new Set(recommendedExercises.map((e) => e.id));
  const otherExercises = allExercises.filter((e) => !recommendedIds.has(e.id));

  return [...recommendedExercises, ...otherExercises];
};

/**
 * Get a specific exercise
 */
export const getExercise = async (exerciseId: string) => {
  const exercise = await prisma.selfHelpExercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) {
    throw new Error('Exercise not found');
  }

  if (!exercise.isActive) {
    throw new Error('Exercise is not available');
  }

  return exercise;
};

/**
 * Mark an exercise as completed
 */
export const completeExercise = async (data: CompleteExerciseData) => {
  // Validate rating if provided
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Verify exercise exists
  const exercise = await prisma.selfHelpExercise.findUnique({
    where: { id: data.exerciseId },
  });

  if (!exercise) {
    throw new Error('Exercise not found');
  }

  // Create completion record
  const completion = await prisma.exerciseCompletion.create({
    data: {
      userId: data.userId,
      exerciseId: data.exerciseId,
      duration: data.duration,
      rating: data.rating,
    },
  });

  return completion;
};

/**
 * Get user exercise progress
 */
export const getExerciseProgress = async (params: GetExerciseProgressParams) => {
  const completions = await prisma.exerciseCompletion.findMany({
    where: { userId: params.userId },
    orderBy: { completedAt: 'desc' },
    take: 20,
    include: {
      exercise: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
    },
  });

  // Get unique exercises completed
  const uniqueExerciseIds = new Set(completions.map((c) => c.exerciseId));
  const exercisesCompleted = uniqueExerciseIds.size;

  return {
    totalCompletions: completions.length,
    exercisesCompleted,
    recentCompletions: completions.map((c) => ({
      id: c.id,
      exerciseId: c.exerciseId,
      exerciseTitle: c.exercise.title,
      completedAt: c.completedAt,
      duration: c.duration,
      rating: c.rating,
    })),
  };
};

