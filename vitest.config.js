import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    fileParallelism: false,
    pool: 'threads',
    singleThread: true,
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/_test/**',
        '**/test/**',
        '**/config.js',
      ],
    },
  },
});