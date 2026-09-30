import { defineConfig, devices } from '@playwright/test';

// No @types/node in the audited dependency set; declare the one global used here.
declare const process: { env: Record<string, string | undefined> };

const PORT = process.env.E2E_PORT ?? '4321';
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  use: { baseURL },
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
