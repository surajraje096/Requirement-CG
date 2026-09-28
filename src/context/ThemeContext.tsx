import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'executive-navy' | 'dark' | 'nordic' | 'cyber' | 'sunset';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleLightDark: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('rqa-theme');
    if (saved && ['light', 'executive-navy', 'dark', 'nordic', 'cyber', 'sunset'].includes(saved)) {
      return saved as ThemeMode;
    }
    // Set to Executive Navy upon user's "change theam" request
    return 'executive-navy';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('rqa-theme', newTheme);
  };

  const toggleLightDark = () => {
    if (theme === 'light') {
      setTheme('executive-navy');
    } else {
      setTheme('light');
    }
  };

  const isDark = theme !== 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-950', 'text-slate-100', 'bg-slate-900');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleLightDark, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
