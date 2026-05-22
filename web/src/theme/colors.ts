/**
 * Fixam Design System — Color Tokens
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all brand and semantic colors.
 * These must stay in sync with the CSS custom properties in index.css.
 */

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------
export const COLORS = {
  // ─── Primary Teal ────────────────────────────────────────────────────────
  primary:        '#0D9488',
  primaryDark:    '#0F766E',
  primaryLight:   '#14B8A6',

  // ─── Blue ─────────────────────────────────────────────────────────────────
  blue:           '#2563EB',
  blueAccent:     '#3B82F6',
  blueDark:       '#1D4ED8',
  blueLight:      '#60A5FA',

  // ─── Navy ─────────────────────────────────────────────────────────────────
  navy:           '#0F172A',
  navySoft:       '#1E293B',
  navyLight:      '#334155',

  // ─── Semantic / Status ────────────────────────────────────────────────────
  success:        '#22C55E',
  successDark:    '#16A34A',
  successLight:   '#86EFAC',
  successBg:      '#DCFCE7',

  warning:        '#F59E0B',
  warningDark:    '#D97706',
  warningLight:   '#FCD34D',
  warningBg:      '#FEF3C7',

  danger:         '#EF4444',
  dangerDark:     '#DC2626',
  dangerLight:    '#FCA5A5',
  dangerBg:       '#FEE2E2',

  info:           '#3B82F6',
  infoDark:       '#2563EB',
  infoLight:      '#93C5FD',
  infoBg:         '#DBEAFE',

  // ─── Teal Palette ─────────────────────────────────────────────────────────
  teal50:         '#F0FDFA',
  teal100:        '#CCFBF1',
  teal200:        '#99F6E4',
  teal300:        '#5EEAD4',
  teal400:        '#2DD4BF',
  teal500:        '#14B8A6',
  teal600:        '#0D9488',
  teal700:        '#0F766E',
  teal800:        '#115E59',
  teal900:        '#134E4A',

  // ─── Blue Palette ─────────────────────────────────────────────────────────
  blue50:         '#EFF6FF',
  blue100:        '#DBEAFE',
  blue200:        '#BFDBFE',
  blue300:        '#93C5FD',
  blue400:        '#60A5FA',
  blue500:        '#3B82F6',
  blue600:        '#2563EB',
  blue700:        '#1D4ED8',
  blue800:        '#1E40AF',
  blue900:        '#1E3A8A',

  // ─── Slate / Neutral ──────────────────────────────────────────────────────
  slate50:        '#F8FAFC',
  slate100:       '#F1F5F9',
  slate200:       '#E2E8F0',
  slate300:       '#CBD5E1',
  slate400:       '#94A3B8',
  slate500:       '#64748B',
  slate600:       '#475569',
  slate700:       '#334155',
  slate800:       '#1E293B',
  slate900:       '#0F172A',
  slate950:       '#020617',

  // ─── Absolute ─────────────────────────────────────────────────────────────
  white:          '#FFFFFF',
  black:          '#000000',
  transparent:    'transparent',

  // ─── Light Mode Semantic Surface Tokens ──────────────────────────────────
  light: {
    bg:           '#F8FAFC',
    surface:      '#FFFFFF',
    surfaceAlt:   '#F1F5F9',
    text:         '#1E293B',
    textHeading:  '#0F172A',
    textMuted:    '#64748B',
    textDisabled: '#94A3B8',
    border:       '#E2E8F0',
    accent:       '#0D9488',
  },

  // ─── Dark Mode Semantic Surface Tokens ───────────────────────────────────
  dark: {
    bg:           '#020617',
    surface:      '#0F172A',
    surfaceAlt:   '#111827',
    text:         '#E2E8F0',
    textHeading:  '#F8FAFC',
    textMuted:    '#94A3B8',
    textDisabled: '#475569',
    border:       '#1E293B',
    accent:       '#14B8A6',
  },
} as const;

// ---------------------------------------------------------------------------
// Gradient Definitions
// ---------------------------------------------------------------------------
export const GRADIENTS = {
  /** Core brand gradient — teal → blue (135°) */
  primary:        'linear-gradient(135deg, #0D9488, #2563EB)',

  /** Teal-only gradient */
  teal:           'linear-gradient(135deg, #0D9488, #14B8A6)',

  /** Blue-only gradient */
  blue:           'linear-gradient(135deg, #2563EB, #3B82F6)',

  /** Dark navy gradient */
  navy:           'linear-gradient(135deg, #0F172A, #1E293B)',

  /** Subtle light surface gradient */
  surfaceLight:   'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',

  /** Subtle dark surface gradient */
  surfaceDark:    'linear-gradient(180deg, #0F172A 0%, #020617 100%)',

  /** Hero background gradient — light mode */
  heroLight:      'linear-gradient(135deg, #F0FDFA 0%, #EFF6FF 50%, #F8FAFC 100%)',

  /** Hero background gradient — dark mode */
  heroDark:       'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)',

  /** Success gradient */
  success:        'linear-gradient(135deg, #16A34A, #22C55E)',

  /** Warning gradient */
  warning:        'linear-gradient(135deg, #D97706, #F59E0B)',

  /** Danger gradient */
  danger:         'linear-gradient(135deg, #DC2626, #EF4444)',

  /** Glass overlay (for card backgrounds) */
  glass:          'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.60))',

  /** Glass overlay — dark */
  glassDark:      'linear-gradient(135deg, rgba(15,23,42,0.80), rgba(15,23,42,0.60))',

  /** Mesh gradient for decorative backgrounds */
  mesh:           `
    radial-gradient(at 20% 25%, rgba(13,148,136,0.15) 0px, transparent 50%),
    radial-gradient(at 80% 75%, rgba(37,99,235,0.12) 0px, transparent 50%),
    radial-gradient(at 50% 50%, rgba(20,184,166,0.06) 0px, transparent 70%)
  `.replace(/\s+/g, ' ').trim(),

  /** Shimmer animation gradient for skeleton loading */
  shimmer:        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',

  /** Shimmer dark */
  shimmerDark:    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
} as const;

// ---------------------------------------------------------------------------
// Shadow Tokens (as CSS box-shadow strings)
// ---------------------------------------------------------------------------
export const SHADOWS = {
  sm:       '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
  md:       '0 4px 16px -2px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)',
  lg:       '0 10px 32px -4px rgba(0,0,0,0.12), 0 4px 16px -4px rgba(0,0,0,0.08)',
  xl:       '0 20px 48px -8px rgba(0,0,0,0.16), 0 8px 24px -6px rgba(0,0,0,0.10)',
  teal:     '0 8px 32px -4px rgba(13,148,136,0.30)',
  tealLg:   '0 16px 48px -8px rgba(13,148,136,0.40)',
  blue:     '0 8px 32px -4px rgba(37,99,235,0.25)',
  blueLg:   '0 16px 48px -8px rgba(37,99,235,0.35)',
  premium:  '0 24px 64px -12px rgba(0,0,0,0.18), 0 8px 32px -8px rgba(0,0,0,0.12)',
  none:     'none',
} as const;

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------
export type ColorKey     = keyof typeof COLORS;
export type GradientKey  = keyof typeof GRADIENTS;
export type ShadowKey    = keyof typeof SHADOWS;
