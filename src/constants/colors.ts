/**
 * Color Palette for Havens App
 * Based on color psychology for mental health applications
 * All colors follow WCAG 2.1 AA contrast requirements
 */

export const Colors = {
  // Primary Colors
  primary: '#4A90E2', // Serene Blue - Primary actions, trust, calm
  secondary: '#5BC8AF', // Soft Teal - Secondary actions, growth, healing
  accent: '#9B8FB8', // Warm Lavender - Accent, mindfulness, peace

  // Neutral Colors
  white: '#FFFFFF', // Pure White - Backgrounds, cards
  grayLight: '#F5F7FA', // Soft Gray - Secondary backgrounds, subtle dividers
  grayMedium: '#8E8E93', // Medium Gray - Secondary text, icons
  grayDark: '#1C1C1E', // Dark Gray - Primary text, headings

  // Semantic Colors
  success: '#34C759', // Success Green - Positive feedback, completed actions
  warning: '#FF9500', // Warning Amber - Important notices, caution
  crisis: '#FF3B30', // Crisis Red - Crisis resources, urgent actions
  info: '#007AFF', // Info Blue - Information, links

  // Mood Colors (for mood wheel/tracking)
  mood: {
    happy: '#FFD700', // Gold/Yellow
    calm: '#87CEEB', // Sky Blue
    anxious: '#FF6B6B', // Soft Red
    sad: '#6B7FD7', // Periwinkle
    angry: '#FF8C42', // Coral
    grateful: '#90EE90', // Light Green
  },
} as const;

export type ColorName = keyof typeof Colors;
export type MoodColorName = keyof typeof Colors.mood;

