import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightTheme = {
  colors: {
    primary: '#5B4CCC',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F5F5',
    secondaryForeground: '#000000',
    background: '#FFFFFF',
    foreground: '#000000',
    muted: '#9E9E9E',
    mutedForeground: '#757575',
    border: '#E0E0E0',
    error: '#EF4444',
  }
};

const darkTheme = {
  colors: {
    primary: '#7C6FDC',
    primaryForeground: '#FFFFFF',
    secondary: '#2A2A2A',
    secondaryForeground: '#FFFFFF',
    background: '#121212',
    foreground: '#FFFFFF',
    muted: '#6B6B6B',
    mutedForeground: '#A0A0A0',
    border: '#404040',
    error: '#F87171',
  }
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};