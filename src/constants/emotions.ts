/**
 * Emotion Labels and Colors for Mood Tracking
 * Based on RULER framework and emotional literacy best practices
 * 10-20 emotion labels for mood tracking feature
 */

import { Colors } from './colors';

export interface Emotion {
  label: string;
  color: string;
  category: 'positive' | 'neutral' | 'negative';
  intensity?: number; // 1-10 scale
}

export const Emotions: Emotion[] = [
  // Positive Emotions
  { label: 'happy', color: Colors.mood.happy, category: 'positive' },
  { label: 'grateful', color: Colors.mood.grateful, category: 'positive' },
  { label: 'calm', color: Colors.mood.calm, category: 'positive' },
  { label: 'content', color: '#87CEEB', category: 'positive' },
  { label: 'hopeful', color: '#90EE90', category: 'positive' },
  { label: 'energetic', color: '#FFD700', category: 'positive' },
  { label: 'peaceful', color: '#9B8FB8', category: 'positive' },
  { label: 'confident', color: '#4A90E2', category: 'positive' },

  // Neutral Emotions
  { label: 'neutral', color: Colors.grayMedium, category: 'neutral' },
  { label: 'tired', color: '#8E8E93', category: 'neutral' },
  { label: 'numb', color: '#8E8E93', category: 'neutral' },

  // Negative Emotions
  { label: 'anxious', color: Colors.mood.anxious, category: 'negative' },
  { label: 'sad', color: Colors.mood.sad, category: 'negative' },
  { label: 'angry', color: Colors.mood.angry, category: 'negative' },
  { label: 'overwhelmed', color: '#FF6B6B', category: 'negative' },
  { label: 'frustrated', color: '#FF8C42', category: 'negative' },
  { label: 'lonely', color: '#6B7FD7', category: 'negative' },
  { label: 'stressed', color: '#FF6B6B', category: 'negative' },
  { label: 'worried', color: '#FF8C42', category: 'negative' },
  { label: 'disappointed', color: '#6B7FD7', category: 'negative' },
  { label: 'guilty', color: '#6B7FD7', category: 'negative' },
];

/**
 * Get emotion by label
 */
export const getEmotionByLabel = (label: string): Emotion | undefined => {
  return Emotions.find((emotion) => emotion.label.toLowerCase() === label.toLowerCase());
};

/**
 * Get emotions by category
 */
export const getEmotionsByCategory = (category: Emotion['category']): Emotion[] => {
  return Emotions.filter((emotion) => emotion.category === category);
};

/**
 * Get all emotion labels
 */
export const getEmotionLabels = (): string[] => {
  return Emotions.map((emotion) => emotion.label);
};

/**
 * Mood intensity scale (1-10)
 */
export const MoodIntensity = {
  veryLow: 1,
  low: 3,
  moderate: 5,
  high: 7,
  veryHigh: 10,
} as const;

