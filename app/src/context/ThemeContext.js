import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const LIGHT_COLORS = {
  primary: '#0D1B2A',
  accent: '#1E67D1',
  accentSoft: '#EAF2FF',
  teal: '#14B8A6',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#0D1B2A',
  textSecondary: '#4B5563',
  placeholder: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  divider: '#F3F4F6',
  success: '#22C55E',
  error: '#EF4444',
  navyDark: '#0D1B2A',
  white: '#FFFFFF',
};

const DARK_COLORS = {
  primary: '#E2E8F0',
  accent: '#60A5FA',
  accentSoft: 'rgba(96, 165, 250, 0.14)',
  teal: '#2DD4BF',
  background: '#0F172A', 
  surface: 'rgba(255, 255, 255, 0.03)',
  text: '#FFFFFF', // Pure white for perfect readability against gradient
  textSecondary: '#CBD5E1', // Brighter secondary text to remove blurriness
  placeholder: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.1)', // Soft borders
  card: 'rgba(15, 23, 42, 0.65)', // Semi-transparent glass effect to let gradient shine
  tabBar: '#0A0F1C', 
  divider: 'rgba(255, 255, 255, 0.05)',
  success: '#34D399',
  error: '#F87171',
  navyDark: '#020617',
  white: '#FFFFFF',
};
