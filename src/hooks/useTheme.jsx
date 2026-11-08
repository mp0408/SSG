'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'ssgpl-theme';
const THEME_COLOR = { dark: '#040710', light: '#f3f6fc' };
const ThemeContext = createContext(null);

const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const readTheme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode): the theme still applies for this visit */
  }
  listeners.forEach((listener) => listener());
};

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark');

  /** Circular reveal from the pointer on desktop. Phones switch instantly: a full-page snapshot is slow there. */
  const toggleTheme = useCallback((event) => {
    const next = readTheme() === 'dark' ? 'light' : 'dark';
    const simple =
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches;
    if (simple) {
      applyTheme(next);
      return;
    }
    const x = event?.clientX ?? window.innerWidth - 40;
    const y = event?.clientY ?? 32;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(() => applyTheme(next)));
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => {});
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
