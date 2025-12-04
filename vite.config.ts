import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/novelo/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@core': '/src/core',
      '@state': '/src/state',
      '@input': '/src/input',
      '@ui': '/src/ui',
      '@config': '/src/config',
    },
  },
});
