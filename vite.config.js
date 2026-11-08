import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Long-lived vendor chunks: app deploys don't bust the framework cache.
const VENDOR_CHUNKS = [
  ['react', /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|cookie|set-cookie-parser)[\\/]/],
  ['motion', /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/],
];

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => VENDOR_CHUNKS.find(([, pattern]) => pattern.test(id))?.[0],
      },
    },
  },
});
