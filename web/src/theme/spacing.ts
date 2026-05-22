/**
 * Fixam Design System — Spacing Tokens
 * ─────────────────────────────────────────────────────────────────────────────
 * Consistent spacing scale based on 4px baseline grid.
 * Use these for margins, paddings, gaps, and other spacing needs.
 */

export const SPACING = {
  // Base units (4px grid)
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// Semantic spacing presets
export const SPACING_PRESETS = {
  // Container padding
  container: {
    xs: SPACING[4], // 16px
    sm: SPACING[6], // 24px
    md: SPACING[8], // 32px
    lg: SPACING[10], // 40px
  },

  // Component padding
  component: {
    sm: SPACING[3], // 12px
    md: SPACING[4], // 16px
    lg: SPACING[6], // 24px
    xl: SPACING[8], // 32px
  },

  // Gap presets
  gap: {
    xs: SPACING[2], // 8px
    sm: SPACING[3], // 12px
    md: SPACING[4], // 16px
    lg: SPACING[6], // 24px
    xl: SPACING[8], // 32px
  },

  // Section spacing
  section: {
    xs: SPACING[8], // 32px
    sm: SPACING[12], // 48px
    md: SPACING[16], // 64px
    lg: SPACING[20], // 80px
    xl: SPACING[24], // 96px
  },
} as const;

// Border radius scale
export const BORDER_RADIUS = {
  none: '0px',
  xs: '0.25rem', // 4px
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px',
} as const;

// Semantic radius presets
export const BORDER_RADIUS_PRESETS = {
  button: BORDER_RADIUS.lg, // 12px
  card: BORDER_RADIUS.xl, // 16px
  input: BORDER_RADIUS.md, // 8px
  modal: BORDER_RADIUS['2xl'], // 24px
  pill: BORDER_RADIUS.full, // 9999px
  badge: BORDER_RADIUS.full,
  avatar: BORDER_RADIUS.full,
} as const;
