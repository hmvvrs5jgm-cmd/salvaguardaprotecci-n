import { defineConfig, devices } from '@playwright/test';

// PW_CHROMIUM_PATH permite usar un Chromium preinstalado (p. ej., /opt/pw-browsers/chromium-1194/chrome-linux/chrome).
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list']],
  use: { trace: 'off', launchOptions },
  webServer: [
    {
      command: 'npx vite build && npx vite preview --port 4173 --strictPort',
      url: 'http://localhost:4173/',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command:
        'VITE_BASE_PATH=/salvaguardaprotecci-n/ npx vite build --outDir dist-pages && VITE_BASE_PATH=/salvaguardaprotecci-n/ npx vite preview --outDir dist-pages --port 4174 --strictPort',
      url: 'http://localhost:4174/salvaguardaprotecci-n/',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: 'escritorio',
      testIgnore: /pages\.spec/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4173/', launchOptions },
    },
    {
      name: 'movil-320',
      testIgnore: /pages\.spec/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 }, hasTouch: true, baseURL: 'http://localhost:4173/', launchOptions },
    },
    {
      name: 'pages',
      testMatch: /pages\.spec/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4174/', launchOptions },
    },
  ],
});
