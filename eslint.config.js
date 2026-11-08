import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  { ignores: ['.next/**', 'node_modules/**', 'public/**'] },
  ...nextCoreWebVitals,
  {
    rules: {
      // Images are pre-optimised to WebP by scripts/optimize-images.mjs and served with srcSet.
      '@next/next/no-img-element': 'off',
    },
  },
];
