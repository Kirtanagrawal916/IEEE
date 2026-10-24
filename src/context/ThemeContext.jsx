import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('herearn_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply temporary transition class only during user-initiated toggles, not on first paint
    if (!isInitialMount.current) {
      root.classList.add('theme-transition');
      body.classList.add('theme-transition');
    }

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    }

    try {
      localStorage.setItem('herearn_theme', theme);
    } catch (err) {
      console.warn('[ThemeContext] Storage warning:', err);
    }

    if (!isInitialMount.current) {
      const transitionTimer = setTimeout(() => {
        root.classList.remove('theme-transition');
        body.classList.remove('theme-transition');
      }, 300);
      return () => clearTimeout(transitionTimer);
    } else {
      isInitialMount.current = false;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
