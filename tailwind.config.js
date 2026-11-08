/** @type {import('tailwindcss').Config} */

// Colours are CSS variables (RGB triplets) so one class works in both themes.
// See src/styles/index.css for the light/dark values.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const config = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  // Touch screens never get stuck in a hover state.
  future: { hoverOnlyWhenSupported: true },
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
        sans: ['var(--font-geist)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-archivo)', 'Impact', 'system-ui', 'sans-serif'],
        gujarati: ['var(--font-gujarati)', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        label: '0.14em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 1px 0 rgb(var(--ink) / 0.04) inset, 0 20px 40px -24px rgb(0 0 0 / 0.45)',
        lift: '0 24px 48px -28px rgb(var(--glow) / 0.45)',
      },
      keyframes: {
        marquee: { to: { transform: 'translate3d(-100%,0,0)' } },
        'marquee-reverse': { from: { transform: 'translate3d(-100%,0,0)' }, to: { transform: 'translate3d(0,0,0)' } },
        ping: { '75%, 100%': { transform: 'scale(2.4)', opacity: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translate3d(0,14px,0)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 40s) linear infinite',
        ping: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards',
      },
    },
  },
  plugins: [],
};

export default config;
