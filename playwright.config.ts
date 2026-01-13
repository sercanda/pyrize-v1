<<<<<<< HEAD
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  },
  reporter: [['list']],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});

=======
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  },
  reporter: [['list']],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});

>>>>>>> 443061a79f7ac9272c9ca4805e98964e4cad8f67
