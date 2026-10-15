/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig as defineVitestConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineVitestConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    env: {
      VITE_API_URL: 'http://localhost:3000'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage'
    }
  }
});
