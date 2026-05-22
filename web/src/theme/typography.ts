/**
 * Fixam Design System — Typography Tokens
 * ─────────────────────────────────────────────────────────────────────────────
 * Typography scale, font families, and weights for consistent text styling.
 * Uses Poppins for headings and Inter for body text.
 */

export const TYPOGRAPHY = {
  // Font families
  families: {
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Monaco", monospace',
  },

  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Heading scales
  heading: {
    h1: {
      size: '3.5rem', // 56px
      lineHeight: '1.15',
      weight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      size: '2.75rem', // 44px
      lineHeight: '1.2',
      weight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      size: '2rem', // 32px
      lineHeight: '1.3',
      weight: 600,
      letterSpacing: '-0.005em',
    },
    h4: {
      size: '1.5rem', // 24px
      lineHeight: '1.35',
      weight: 600,
      letterSpacing: '0',
    },
    h5: {
      size: '1.25rem', // 20px
      lineHeight: '1.4',
      weight: 600,
      letterSpacing: '0',
    },
    h6: {
      size: '1rem', // 16px
      lineHeight: '1.5',
      weight: 600,
      letterSpacing: '0',
    },
  },

  // Body text scales
  body: {
    lg: {
      size: '1.125rem', // 18px
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '-0.005em',
    },
    base: {
      size: '1rem', // 16px
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '-0.005em',
    },
    sm: {
      size: '0.875rem', // 14px
      lineHeight: '1.57',
      weight: 400,
      letterSpacing: '-0.003em',
    },
    xs: {
      size: '0.75rem', // 12px
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0',
    },
  },

  // Label/Caption scales
  label: {
    lg: {
      size: '0.875rem', // 14px
      lineHeight: '1.5',
      weight: 500,
      letterSpacing: '-0.005em',
    },
    base: {
      size: '0.8125rem', // 13px
      lineHeight: '1.54',
      weight: 500,
      letterSpacing: '-0.003em',
    },
    sm: {
      size: '0.75rem', // 12px
      lineHeight: '1.5',
      weight: 500,
      letterSpacing: '0',
    },
    xs: {
      size: '0.6875rem', // 11px
      lineHeight: '1.45',
      weight: 500,
      letterSpacing: '0.01em',
    },
  },
} as const;

// Export Tailwind-compatible class strings for utility generation
export const HEADING_CLASSES = {
  h1: 'text-[3.5rem] leading-[1.15] font-bold -tracking-[0.02em]',
  h2: 'text-[2.75rem] leading-[1.2] font-bold -tracking-[0.01em]',
  h3: 'text-[2rem] leading-[1.3] font-semibold -tracking-[0.005em]',
  h4: 'text-[1.5rem] leading-[1.35] font-semibold',
  h5: 'text-[1.25rem] leading-[1.4] font-semibold',
  h6: 'text-base leading-[1.5] font-semibold',
} as const;

export const BODY_CLASSES = {
  lg: 'text-[1.125rem] leading-[1.6] -tracking-[0.005em]',
  base: 'text-base leading-[1.6] -tracking-[0.005em]',
  sm: 'text-sm leading-[1.57] -tracking-[0.003em]',
  xs: 'text-xs leading-[1.5]',
} as const;
