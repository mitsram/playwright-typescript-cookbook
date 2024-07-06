import { defineConfig, devices } from '@playwright/test';
import dotnev from 'dotenv';
dotnev.config();

const env = process.env.APP_ENVIRONMENT;
const headless = process.env.HEADLESS || 'true';
const baseUrl = env ? `https:${env}.saucedemo.com//` : 'https://saucedemo.com';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 25000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,  
  use: {
    baseURL: baseUrl,
    headless: (headless === 'true'),
    trace: 'on',
    ignoreHTTPSErrors: true,
    actionTimeout: 0,
    viewport: { height: 1080, width: 1920},
    screenshot: 'only-on-failure'
  },
  outputDir: 'playwright-results',  
  reporter: [
    ['list'], 
    ['html']
  ],

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo/specs',
      use: {
        baseURL: 'https://www.saucedemo.com/'
      },
      outputDir: './test-results/saucedemo/'
    },
    {
      name: 'petstore',
      testDir: './tests/petstore-api/specs',
      use: {
        baseURL: 'petstore.swagger.io/v2'
      },
      outputDir: './test-results/petstore/'
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
