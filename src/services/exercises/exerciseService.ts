/**
 * Exercise Service
 * Handles self-help exercise API communication and local state management
 */

import { apiClient } from '../api/client';

export interface SelfHelpExercise {
  id: string;
  type: 'Breathing' | 'Mindfulness' | 'Affirmation' | 'DistressTolerance' | 'ProgressiveRelaxation';
  title: string;
  description: string;
  instructions: string[];
  duration?: number;
  evidenceBasedTechnique: string;
  isActive: boolean;
}

export interface ExerciseCompletion {
  id: string;
  userId: string;
  exerciseId: string;
  completedAt: string;
  duration?: number;
  rating?: number;
}

export interface ExerciseProgress {
  totalCompletions: number;
  exercisesCompleted: number;
  recentCompletions: ExerciseCompletion[];
}

export interface GetExercisesParams {
  type?: string;
}

export interface CompleteExerciseData {
  duration?: number;
  rating?: number;
}

class ExerciseService {
  /**
   * Get all exercises
   */
  async getExercises(params?: GetExercisesParams): Promise<SelfHelpExercise[]> {
    try {
      const response = await apiClient.get<{ exercises: SelfHelpExercise[] }>('/exercises', {
        params,
      });

      return response.data.exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  /**
   * Get a specific exercise
   */
  async getExercise(exerciseId: string): Promise<SelfHelpExercise> {
    try {
      const response = await apiClient.get<SelfHelpExercise>(`/exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  }

  /**
   * Mark an exercise as completed
   */
  async completeExercise(
    exerciseId: string,
    data?: CompleteExerciseData,
  ): Promise<ExerciseCompletion> {
    try {
      const response = await apiClient.post<ExerciseCompletion>(
        `/exercises/${exerciseId}/complete`,
        data || {},
      );

      return response.data;
    } catch (error) {
      console.error('Error completing exercise:', error);
      throw error;
    }
  }

  /**
   * Get user exercise progress
   */
  async getExerciseProgress(): Promise<ExerciseProgress> {
    try {
      const response = await apiClient.get<ExerciseProgress>('/exercises/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();

