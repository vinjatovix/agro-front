/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig as defineVitestConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineVitestConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts'
  }
});
