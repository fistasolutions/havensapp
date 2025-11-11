/**
 * Typography System for Havens App
 * Uses system default fonts (San Francisco on iOS, Roboto on Android)
 * Ensures native feel and optimal readability
 */

import { Platform } from 'react-native';

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: 0.5,
    color: '#1C1C1E', // grayDark
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: 0.5,
    color: '#1C1C1E', // grayDark
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: 0.3,
    color: '#1C1C1E', // grayDark
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0.2,
    color: '#1C1C1E', // grayDark
  },

  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24, // 1.5 line height
    letterSpacing: 0,
    color: '#1C1C1E', // grayDark
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 27, // 1.5 line height
    letterSpacing: 0,
    color: '#1C1C1E', // grayDark
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21, // 1.5 line height
    letterSpacing: 0,
    color: '#8E8E93', // grayMedium
  },

  // Secondary Text
  secondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#8E8E93', // grayMedium
  },

  // Labels and Captions
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: '#1C1C1E', // grayDark
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#8E8E93', // grayMedium
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 27,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
} as const;

export type TypographyStyle = keyof typeof Typography;

/**
 * Get system font family based on platform
 */
export const getSystemFont = (): string => {
  return Platform.select({
    ios: 'System', // San Francisco
    android: 'Roboto',
    default: 'System',
  }) || 'System';
};

