import { useState, useEffect } from 'react';

const THEME_KEY = 'app_theme';

export function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || defaultTheme;
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, setTheme, toggleTheme };
}