import { defineConfig } from 'vitest/config';

/** Tests du serveur Express (environnement Node), hors builder Angular. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/server/**/*.spec.ts'],
    coverage: { provider: 'v8', include: ['src/server/**/*.ts'], reportsDirectory: 'coverage/server' },
  },
});
