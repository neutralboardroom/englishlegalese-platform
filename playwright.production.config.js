const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['v1590-production.spec.js', 'v1740-production.spec.js', 'v1750-production.spec.js', 'v1760-production.spec.js', 'v1770-production.spec.js', 'v1780-production.spec.js', 'v1790-production.spec.js'],
  timeout: 30000,
  expect: { timeout: 10000 },
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-production-report', open: 'never' }]],
  use: {
    baseURL: process.env.PRODUCTION_BASE_URL || 'https://englishlegalese.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: false
  },
  projects: [
    { name: 'production-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1365, height: 768 } } },
    { name: 'production-tablet', use: { ...devices['iPad Pro 11'] } },
    { name: 'production-mobile', use: { ...devices['Pixel 7'] } }
  ]
});
