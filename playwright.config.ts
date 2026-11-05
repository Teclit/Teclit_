import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;
const isCI = !!process.env['CI'];

/**
 * Tests e2e sur le build de production (`npm run build` au préalable), servi par
 * le serveur SSR Express réel (en-têtes de sécurité, 404, API de contact sans clé → 503).
 * En local, le Chrome installé est utilisé (PW_CHANNEL=chrome par défaut) ;
 * en CI, le Chromium de Playwright (`npx playwright install --with-deps chromium`).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    channel: process.env['PW_CHANNEL'] ?? (isCI ? undefined : 'chrome'),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node dist/teclit/server/server.mjs',
    env: { PORT: String(PORT), RESEND_API_KEY: '', CONTACT_TO_EMAIL: '', CONTACT_RATE_LIMIT: '1000' },
    url: `http://localhost:${PORT}/healthz`,
    reuseExistingServer: !isCI,
  },
});
