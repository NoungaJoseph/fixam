import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#0D1B2A',      // Deep navy
  accent: '#1E67D1',       // Professional service blue
  accentSoft: '#EAF2FF',
  teal: '#14B8A6',
  background: '#FAFAFA',
  surface: '#FFFFFF',      // Card white
  text: '#0D1B2A',
  textSecondary: '#4B5563',
  placeholder: '#6B7280',
  success: '#22C55E',
  error: '#EF4444',
  white: '#FFFFFF',
  border: '#E5E7EB',
  tagBg: '#E8ECF5',
  tagText: '#4B5563',
  navyDark: '#0D1B2A',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    placeholder: COLORS.placeholder,
    outline: COLORS.border,
  },
};
