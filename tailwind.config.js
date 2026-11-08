/** @type {import('tailwindcss').Config} */

// Colours are CSS variables (RGB triplets) so one class works in both themes.
// See src/styles/index.css for the light/dark values.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        bg: token('bg'),
        'bg-2': token('bg-2'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        brand: token('brand'),
        'brand-ink': token('brand-ink'),
        glow: token('glow'),
        ball: token('ball'),
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Archivo', 'Impact', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        gujarati: ['"Noto Sans Gujarati"', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        label: '0.18em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 1px 0 rgb(var(--ink) / 0.04) inset, 0 20px 40px -24px rgb(0 0 0 / 0.45)',
        lift: '0 30px 60px -30px rgb(var(--brand) / 0.45)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-100%)' } },
        'marquee-reverse': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        ping: { '75%, 100%': { transform: 'scale(2.4)', opacity: '0' } },
        shimmer: { to: { transform: 'translateX(100%)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 40s) linear infinite',
        ping: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
