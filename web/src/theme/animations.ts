/**
 * Fixam Design System — Framer Motion Animation Variants
 * ─────────────────────────────────────────────────────────────────────────────
 * All animation variants are typed with `Variants` from framer-motion.
 * Import the variant you need and spread it onto a `motion.*` component.
 *
 * Example:
 *   <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
 */

import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Shared Transition Presets
// ---------------------------------------------------------------------------
const springGentle: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

const springSnappy: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
};

const easeOut: Transition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.55,
};

const easeOutFast: Transition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.35,
};

// ---------------------------------------------------------------------------
// Fade In Up — element rises from below while fading in
// ---------------------------------------------------------------------------
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOut,
  },
};

// ---------------------------------------------------------------------------
// Fade In Down — element descends from above while fading in
// ---------------------------------------------------------------------------
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOut,
  },
};

// ---------------------------------------------------------------------------
// Fade In — simple opacity transition
// ---------------------------------------------------------------------------
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.4,
    },
  },
};

// ---------------------------------------------------------------------------
// Slide In Left — element slides in from the left
// ---------------------------------------------------------------------------
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOut,
  },
};

// ---------------------------------------------------------------------------
// Slide In Right — element slides in from the right
// ---------------------------------------------------------------------------
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOut,
  },
};

// ---------------------------------------------------------------------------
// Scale In — element scales up from slightly smaller
// ---------------------------------------------------------------------------
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springGentle,
  },
};

// ---------------------------------------------------------------------------
// Bounce In — overshoots slightly before settling
// ---------------------------------------------------------------------------
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.80,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 20,
    },
  },
};

// ---------------------------------------------------------------------------
// Stagger Container — orchestrates child animations in sequence
// ---------------------------------------------------------------------------
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.10,
      delayChildren: 0.05,
    },
  },
};

/** Faster stagger for dense lists */
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/** Slower stagger for hero sections */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.10,
    },
  },
};

// ---------------------------------------------------------------------------
// Scale On Hover — used with whileHover prop
// ---------------------------------------------------------------------------
export const scaleOnHover = {
  /** Spread onto motion.* as `whileHover={scaleOnHover.whileHover}` */
  whileHover: {
    scale: 1.03,
    transition: springSnappy,
  } satisfies TargetAndTransition,
  whileTap: {
    scale: 0.97,
    transition: easeOutFast,
  } satisfies TargetAndTransition,
};

// ---------------------------------------------------------------------------
// Card Hover — card lifts and gains shadow
// ---------------------------------------------------------------------------
export const cardHover = {
  whileHover: {
    y: -6,
    boxShadow: '0 20px 48px -8px rgba(0,0,0,0.16), 0 8px 24px -6px rgba(0,0,0,0.10)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 22,
    },
  } satisfies TargetAndTransition,
  whileTap: {
    y: -2,
    transition: easeOutFast,
  } satisfies TargetAndTransition,
};

// ---------------------------------------------------------------------------
// Button Tap — slight press effect for interactive elements
// ---------------------------------------------------------------------------
export const buttonTap = {
  whileTap: {
    scale: 0.96,
    transition: easeOutFast,
  } satisfies TargetAndTransition,
};

// ---------------------------------------------------------------------------
// Float — perpetual vertical oscillation (use with `animate`)
// ---------------------------------------------------------------------------
export const floatVariant = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

// ---------------------------------------------------------------------------
// Pulse Glow — teal box-shadow pulse (use with `animate`)
// ---------------------------------------------------------------------------
export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0 0px rgba(13,148,136,0.40)',
      '0 0 0 12px rgba(13,148,136,0.00)',
      '0 0 0 0px rgba(13,148,136,0.40)',
    ],
    transition: {
      duration: 2.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

// ---------------------------------------------------------------------------
// Counter Variant — for animated number counting (use with useAnimation + useInView)
// ---------------------------------------------------------------------------
export const counterVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springGentle,
      delay: 0.1,
    },
  },
};

/** Transition config for number counting (pass to `animate` in useMotionValue) */
export const counterTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 2.0,
};

// ---------------------------------------------------------------------------
// Drawer / Modal — slides in from bottom or side
// ---------------------------------------------------------------------------
export const drawerBottom: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.25,
    },
  },
};

export const drawerRight: Variants = {
  hidden: {
    opacity: 0,
    x: '100%',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.22,
    },
  },
};

// ---------------------------------------------------------------------------
// Modal / Dialog — scale + fade
// ---------------------------------------------------------------------------
export const modalVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 6,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.20,
    },
  },
};

// ---------------------------------------------------------------------------
// Overlay / Backdrop — fade
// ---------------------------------------------------------------------------
export const overlayVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.25 },
  },
  exit: {
    opacity: 0,
    transition: { type: 'tween', ease: 'easeIn', duration: 0.20 },
  },
};

// ---------------------------------------------------------------------------
// Toast Notification — slides in from right, exits right
// ---------------------------------------------------------------------------
export const toastVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springSnappy,
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.20,
    },
  },
};

// ---------------------------------------------------------------------------
// List Item — child variant for use inside staggerContainer
// ---------------------------------------------------------------------------
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOutFast,
  },
};

// ---------------------------------------------------------------------------
// Reveal Horizontal — width grows from 0 to 100% (e.g. progress bars)
// ---------------------------------------------------------------------------
export const revealWidth: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      type: 'tween',
      ease: [0.16, 1, 0.3, 1],
      duration: 0.8,
    },
  },
};

// ---------------------------------------------------------------------------
// Exports grouped for convenience
// ---------------------------------------------------------------------------
export const VARIANTS = {
  fadeInUp,
  fadeInDown,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  bounceIn,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  counterVariant,
  drawerBottom,
  drawerRight,
  modalVariant,
  overlayVariant,
  toastVariant,
  listItem,
  revealWidth,
} as const;

export const INTERACTIONS = {
  scaleOnHover,
  cardHover,
  buttonTap,
  floatVariant,
  pulseGlow,
} as const;

export const TRANSITIONS = {
  springGentle,
  springSnappy,
  easeOut,
  easeOutFast,
  counterTransition,
} as const;
