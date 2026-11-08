import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'ssgpl-theme';
const THEME_COLOR = { dark: '#050914', light: '#f6f7fb' };
const ThemeContext = createContext(null);

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
};

const initialTheme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme);

  const setTheme = useCallback((next) => {
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
    setThemeState(next);
  }, []);

  /** Toggle with a circular reveal from the pointer, where the View Transitions API exists. */
  const toggleTheme = useCallback(
    (event) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduce) {
        setTheme(next);
        return;
      }
      const x = event?.clientX ?? window.innerWidth - 40;
      const y = event?.clientY ?? 32;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const transition = document.startViewTransition(() => flushSync(() => setTheme(next)));
      transition.ready
        .then(() =>
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
          ),
        )
        .catch(() => {});
    },
    [theme, setTheme],
  );

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
