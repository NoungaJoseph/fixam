/**
 * Fixam Design System — Shadow Tokens
 * ─────────────────────────────────────────────────────────────────────────────
 * CSS `box-shadow` strings for consistent elevation across the UI.
 * Used in both CSS-in-JS (framer-motion) and Tailwind arbitrary values.
 *
 * Convention:
 *   - Layered shadows (ambient + key) for realism
 *   - Brand-coloured glows for interactive / featured elements
 *   - Dark-mode variants available where ambient differs
 */

// ---------------------------------------------------------------------------
// Base Elevation Scale
// ---------------------------------------------------------------------------
export const SHADOW_SCALE = {
  /** No shadow */
  none: 'none',

  /** Hairline — subtle depth for inputs, chips */
  xs: '0 1px 2px 0 rgba(0,0,0,0.05)',

  /** Low — cards at rest, dropdowns */
  sm: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',

  /** Medium — cards on hover, popovers */
  md: '0 4px 16px -2px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)',

  /** Large — floating panels, menus */
  lg: '0 10px 32px -4px rgba(0,0,0,0.12), 0 4px 16px -4px rgba(0,0,0,0.08)',

  /** Extra large — modals, dialogs */
  xl: '0 20px 48px -8px rgba(0,0,0,0.16), 0 8px 24px -6px rgba(0,0,0,0.10)',

  /** 2XL — full-screen overlays, hero images */
  '2xl': '0 32px 64px -12px rgba(0,0,0,0.20), 0 12px 32px -8px rgba(0,0,0,0.12)',
} as const;

// ---------------------------------------------------------------------------
// Card Shadows
// ---------------------------------------------------------------------------
export const SHADOW_CARD = {
  /** Default card — subtle lift */
  default: '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',

  /** Card hovered — clear elevation */
  hover: '0 12px 40px -8px rgba(0,0,0,0.14), 0 4px 16px -4px rgba(0,0,0,0.08)',

  /** Card active / pressed */
  active: '0 2px 8px -2px rgba(0,0,0,0.08)',

  /** Dark mode card default */
  darkDefault: '0 1px 4px 0 rgba(0,0,0,0.25), 0 1px 2px -1px rgba(0,0,0,0.18)',

  /** Dark mode card hovered */
  darkHover: '0 12px 40px -8px rgba(0,0,0,0.50), 0 4px 16px -4px rgba(0,0,0,0.30)',
} as const;

// ---------------------------------------------------------------------------
// Premium / Feature Shadows
// ---------------------------------------------------------------------------
export const SHADOW_PREMIUM = {
  /** Premium — layered, deep shadow for highlighted sections */
  default: '0 24px 64px -12px rgba(0,0,0,0.18), 0 8px 32px -8px rgba(0,0,0,0.12)',

  /** Premium with teal tint — for primary CTAs */
  tinted: `
    0 24px 64px -12px rgba(0,0,0,0.18),
    0 8px 32px -8px rgba(0,0,0,0.12),
    0 0 0 1px rgba(13,148,136,0.12)
  `.replace(/\s+/g, ' ').trim(),

  /** Hero card — ultra-deep */
  hero: '0 40px 80px -16px rgba(0,0,0,0.22), 0 16px 48px -12px rgba(0,0,0,0.14)',

  /** Inner shadow — for pressed states or inset elements */
  inner: 'inset 0 2px 8px 0 rgba(0,0,0,0.08)',

  /** Floating element — slight ambient */
  floating: '0 8px 28px -4px rgba(0,0,0,0.14), 0 2px 8px -2px rgba(0,0,0,0.08)',
} as const;

// ---------------------------------------------------------------------------
// Teal Glow Shadows (Brand Primary)
// ---------------------------------------------------------------------------
export const SHADOW_TEAL = {
  /** Subtle teal glow — e.g. teal icon containers */
  sm: '0 4px 14px -2px rgba(13,148,136,0.20)',

  /** Standard teal glow — primary buttons, active states */
  default: '0 8px 32px -4px rgba(13,148,136,0.30)',

  /** Strong teal glow — featured cards, hero CTAs */
  lg: '0 16px 48px -8px rgba(13,148,136,0.40)',

  /** Pulse ring — used in animated glow effects */
  ring: '0 0 0 4px rgba(13,148,136,0.20)',

  /** Focus ring */
  focus: '0 0 0 3px rgba(13,148,136,0.30)',

  /** Combined elevation + glow */
  elevated: '0 12px 36px -6px rgba(13,148,136,0.35), 0 4px 12px -3px rgba(0,0,0,0.10)',
} as const;

// ---------------------------------------------------------------------------
// Blue Glow Shadows
// ---------------------------------------------------------------------------
export const SHADOW_BLUE = {
  /** Subtle blue glow */
  sm: '0 4px 14px -2px rgba(37,99,235,0.18)',

  /** Standard blue glow — blue buttons, active links */
  default: '0 8px 32px -4px rgba(37,99,235,0.25)',

  /** Strong blue glow */
  lg: '0 16px 48px -8px rgba(37,99,235,0.35)',

  /** Focus ring */
  focus: '0 0 0 3px rgba(37,99,235,0.25)',

  /** Combined elevation + glow */
  elevated: '0 12px 36px -6px rgba(37,99,235,0.30), 0 4px 12px -3px rgba(0,0,0,0.08)',
} as const;

// ---------------------------------------------------------------------------
// Semantic State Shadows
// ---------------------------------------------------------------------------
export const SHADOW_STATE = {
  /** Success green glow */
  success: '0 4px 14px -2px rgba(34,197,94,0.25)',

  /** Warning amber glow */
  warning: '0 4px 14px -2px rgba(245,158,11,0.25)',

  /** Danger red glow */
  danger:  '0 4px 14px -2px rgba(239,68,68,0.25)',

  /** Info blue glow */
  info:    '0 4px 14px -2px rgba(59,130,246,0.22)',
} as const;

// ---------------------------------------------------------------------------
// Text Shadows
// ---------------------------------------------------------------------------
export const SHADOW_TEXT = {
  /** Subtle text shadow for hero headings on image overlays */
  hero:  '0 2px 12px rgba(0,0,0,0.30)',

  /** White text shadow for dark backgrounds */
  light: '0 1px 4px rgba(0,0,0,0.15)',
} as const;

// ---------------------------------------------------------------------------
// Convenience Flat Export
// ---------------------------------------------------------------------------
export const SHADOWS = {
  ...SHADOW_SCALE,
  card:        SHADOW_CARD.default,
  cardHover:   SHADOW_CARD.hover,
  premium:     SHADOW_PREMIUM.default,
  premiumHero: SHADOW_PREMIUM.hero,
  floating:    SHADOW_PREMIUM.floating,
  inner:       SHADOW_PREMIUM.inner,

  teal:        SHADOW_TEAL.default,
  tealSm:      SHADOW_TEAL.sm,
  tealLg:      SHADOW_TEAL.lg,
  tealFocus:   SHADOW_TEAL.focus,
  tealRing:    SHADOW_TEAL.ring,

  blue:        SHADOW_BLUE.default,
  blueSm:      SHADOW_BLUE.sm,
  blueLg:      SHADOW_BLUE.lg,
  blueFocus:   SHADOW_BLUE.focus,

  success:     SHADOW_STATE.success,
  warning:     SHADOW_STATE.warning,
  danger:      SHADOW_STATE.danger,
  info:        SHADOW_STATE.info,
} as const;

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------
export type ShadowScaleKey   = keyof typeof SHADOW_SCALE;
export type ShadowCardKey    = keyof typeof SHADOW_CARD;
export type ShadowPremiumKey = keyof typeof SHADOW_PREMIUM;
export type ShadowTealKey    = keyof typeof SHADOW_TEAL;
export type ShadowBlueKey    = keyof typeof SHADOW_BLUE;
export type ShadowStateKey   = keyof typeof SHADOW_STATE;
export type ShadowKey        = keyof typeof SHADOWS;
