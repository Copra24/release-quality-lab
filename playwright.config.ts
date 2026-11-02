import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 4173);
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /tests\/(api|ui|accessibility)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chrome',
      testMatch: /tests\/mobile\/.*\.spec\.ts/,
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'node demo-app/server.js',
    url: `${baseURL}/health`,
    env: { PORT: String(port) },
    reuseExistingServer: !process.env.CI,
    timeout: 15_000
  }
});
