import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../utils/audio';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to 'light' mode as requested!
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_cafe_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore
    }
    return 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
  const [targetTheme, setTargetTheme] = useState('light');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('thc_cafe_theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggleTheme = (e) => {
    sounds.playClick();
    
    // Capture origin coordinates from click event or fallback to top right / center
    let x = window.innerWidth - 80;
    let y = 60;
    if (e && typeof e.clientX === 'number') {
      x = e.clientX;
      y = e.clientY;
    }

    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTransitionOrigin({ x, y });
    setTargetTheme(nextTheme);
    setIsTransitioning(true);

    // Switch theme halfway through the screen wipe for seamless reveal
    setTimeout(() => {
      setTheme(nextTheme);
    }, 280);

    // Reset transition state after animation finishes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      isTransitioning,
      transitionOrigin,
      targetTheme,
      isLight: theme === 'light',
      isDark: theme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isTransitioning: false,
      transitionOrigin: { x: 0, y: 0 },
      targetTheme: 'light',
      isLight: true,
      isDark: false
    };
  }
  return context;
}
