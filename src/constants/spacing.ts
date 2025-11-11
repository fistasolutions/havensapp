/**
 * Spacing System for Havens App
 * Based on 8px base unit for consistent spacing
 */

export const Spacing = {
  xs: 4, // Extra small - 0.5 base unit
  sm: 8, // Small - 1 base unit
  md: 16, // Medium - 2 base units (standard padding)
  lg: 24, // Large - 3 base units (card padding)
  xl: 32, // Extra large - 4 base units
  xxl: 48, // 2X extra large - 6 base units
  xxxl: 64, // 3X extra large - 8 base units
} as const;

export type SpacingSize = keyof typeof Spacing;

/**
 * Common spacing patterns
 */
export const SpacingPatterns = {
  screenMargin: Spacing.md, // 16px - Standard screen margins on mobile
  screenMarginTablet: Spacing.lg, // 24px - Screen margins on tablets
  componentPadding: Spacing.md, // 16px - Standard component padding
  cardPadding: Spacing.lg, // 24px - Card component padding
  sectionSpacing: Spacing.xl, // 32px - Spacing between sections
  elementSpacing: Spacing.sm, // 8px - Spacing between related elements
} as const;

