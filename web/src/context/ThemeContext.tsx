/**
 * Fixam Design System — ThemeContext
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides dark / light mode state across the entire application.
 *
 * Features:
 *  - Reads initial preference from localStorage (key: 'fixam-theme')
 *  - Falls back to the OS / system color-scheme preference
 *  - Applies / removes 'dark' class on <html> (document.documentElement)
 *  - Persists preference changes to localStorage
 *  - Dispatches a custom 'fixam:theme-change' event for third-party widgets
 *  - Prevents flash of incorrect theme via a blocking inline script (see below)
 *  - Exports `useTheme()` hook with full TypeScript types
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY  = 'fixam-theme' as const;
const DARK_CLASS   = 'dark'        as const;
const THEME_EVENT  = 'fixam:theme-change' as const;

type Theme = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the persisted theme from localStorage (SSR-safe). */
function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage unavailable (private browsing, SSR, etc.)
  }
  return null;
}

/** Detect the OS / system dark-mode preference. */
function getSystemTheme(): Theme {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // matchMedia not available
  }
  return 'light';
}

/** Resolve the initial theme: stored > system. */
function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

/** Apply the theme to the DOM and persist to storage. */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }

  // Persist
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }

  // Notify third-party widgets / analytics
  try {
    window.dispatchEvent(
      new CustomEvent(THEME_EVENT, { detail: { theme } }),
    );
  } catch {
    // ignore
  }

  // Sync <meta name="color-scheme"> for native UI elements (scrollbars, inputs)
  let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    document.head.appendChild(meta);
  }
  meta.content = theme === 'dark' ? 'dark light' : 'light dark';
}

// ---------------------------------------------------------------------------
// Context Shape
// ---------------------------------------------------------------------------
interface ThemeContextValue {
  /** Current resolved theme */
  theme: Theme;

  /** Whether dark mode is active */
  isDark: boolean;

  /** Toggle between dark and light */
  toggleTheme: () => void;

  /** Explicitly set a specific theme */
  setTheme: (theme: Theme) => void;
}

// ---------------------------------------------------------------------------
// Context Creation
// ---------------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Optional override — useful for Storybook / tests.
   * When provided, overrides localStorage and system preference.
   */
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return defaultTheme ?? resolveInitialTheme();
  });

  // Apply theme to DOM on mount and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for OS-level preference changes (e.g. user switches system theme)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't set an explicit preference
      const stored = getStoredTheme();
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  // Listen for external 'fixam:theme-change' events (e.g. from embedded iframes)
  useEffect(() => {
    const handleExternalChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: Theme }>).detail;
      if (detail?.theme && detail.theme !== theme) {
        setThemeState(detail.theme);
      }
    };

    window.addEventListener(THEME_EVENT, handleExternalChange);
    return () => {
      window.removeEventListener(THEME_EVENT, handleExternalChange);
    };
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * `useTheme()` — access the current theme state and controls.
 *
 * @example
 * ```tsx
 * const { isDark, toggleTheme } = useTheme();
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
 *   </button>
 * );
 * ```
 *
 * @throws {Error} if called outside of a `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (ctx === undefined) {
    throw new Error(
      '[Fixam] useTheme() must be called inside a <ThemeProvider>.\n' +
      'Make sure your component tree is wrapped with <ThemeProvider>.',
    );
  }

  return ctx;
}

// ---------------------------------------------------------------------------
// Inline Script (Flash Prevention)
// ---------------------------------------------------------------------------
/**
 * Anti-FOIT (Flash of Incorrect Theme) inline script.
 *
 * Insert this as a raw <script> tag in your index.html <head>,
 * BEFORE any stylesheets or React renders:
 *
 * ```html
 * <script>
 *   (function(){
 *     var s = localStorage.getItem('fixam-theme');
 *     var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 *     if (s === 'dark' || (!s && prefersDark)) {
 *       document.documentElement.classList.add('dark');
 *     }
 *   })();
 * </script>
 * ```
 *
 * This is intentionally kept as a comment here — copy it to your index.html.
 * The minified version is exported below for programmatic injection.
 */
export const ANTI_FLASH_SCRIPT = `(function(){var s=localStorage.getItem('fixam-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d)){document.documentElement.classList.add('dark');}})();`;

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export type { Theme, ThemeContextValue };
export default ThemeContext;
