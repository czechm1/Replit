/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@components': resolve(__dirname, './client/src/components'),
      '@lib': resolve(__dirname, './client/src/lib'),
      '@hooks': resolve(__dirname, './client/src/hooks'),
      '@context': resolve(__dirname, './client/src/context'),
      '@data': resolve(__dirname, './client/src/data'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
});