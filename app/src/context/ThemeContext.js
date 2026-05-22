import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(v => !v);
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// ─── PREMIUM LIGHT MODE ────────────────────────────────────────────────────────
const LIGHT_COLORS = {
  // Brand
  primary:      '#0F172A',
  accent:       '#0D9488',        // Primary Teal
  accentBlue:   '#2563EB',        // Modern Blue
  accentLight:  '#14B8A6',        // Secondary Teal
  accentSoft:   '#F0FDFA',        // Teal wash
  accentBlueSoft: '#EFF6FF',
  teal:         '#14B8A6',

  // Surfaces
  background:   '#F8FAFC',
  surface:      '#FFFFFF',
  card:         '#FFFFFF',
  tabBar:       '#FFFFFF',
  divider:      '#F1F5F9',

  // Text
  text:          '#0F172A',
  textSecondary: '#64748B',
  placeholder:   '#94A3B8',

  // Borders
  border:        '#E2E8F0',

  // Status
  success:  '#22C55E',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#3B82F6',

  // Gradients (used in JS-driven gradient backgrounds)
  gradientStart: '#0D9488',
  gradientEnd:   '#2563EB',

  // Misc
  white:    '#FFFFFF',
  navyDark: '#0F172A',
  overlay:  'rgba(15,23,42,0.5)',
};

// ─── PREMIUM DARK MODE ─────────────────────────────────────────────────────────
const DARK_COLORS = {
  // Brand
  primary:      '#F8FAFC',
  accent:       '#14B8A6',        // Brighter teal for dark
  accentBlue:   '#3B82F6',
  accentLight:  '#0D9488',
  accentSoft:   'rgba(20,184,166,0.15)',
  accentBlueSoft: 'rgba(59,130,246,0.15)',
  teal:         '#2DD4BF',

  // Surfaces
  background:   '#020617',        // Deep navy
  surface:      '#0F172A',
  card:         '#111827',
  tabBar:       '#0F172A',
  divider:      '#1E293B',

  // Text
  text:          '#F8FAFC',
  textSecondary: '#94A3B8',
  placeholder:   '#475569',

  // Borders
  border:        '#1E293B',

  // Status
  success:  '#22C55E',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#60A5FA',

  // Gradients
  gradientStart: '#0D9488',
  gradientEnd:   '#1D4ED8',

  // Misc
  white:    '#FFFFFF',
  navyDark: '#020617',
  overlay:  'rgba(0,0,0,0.65)',
};
