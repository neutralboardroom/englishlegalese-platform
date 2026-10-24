const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: ['v1590-production.spec.js', 'v1740-production.spec.js', 'v1750-production.spec.js', 'v1760-production.spec.js', 'v1770-production.spec.js', 'v1780-production.spec.js', 'v1790-production.spec.js', 'v1800-production.spec.js', 'v1810-production.spec.js', 'v1820-production.spec.js', 'v1830-production.spec.js', 'v1840-production.spec.js', 'v1850-production.spec.js', 'v1850-followthrough-production.spec.js', 'v1860-production.spec.js', 'v1870-production.spec.js'],
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'PORT=4173 node server.js',
    url: 'http://127.0.0.1:4173/health',
    reuseExistingServer: false,
    timeout: 30000
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 900, height: 1100 } } },
    { name: 'tablet-webkit', use: { ...devices['iPad Pro 11'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], browserName: 'chromium' } }
  ]
});
