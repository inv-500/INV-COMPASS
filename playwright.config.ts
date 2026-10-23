import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;

// The cloud sandbox ships its own Chromium; set this to use it instead of downloading one.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // Fixed on purpose: the tests must never inherit Supabase settings from the machine they run on
    // (a machine could carry the address of a different project). The home page shows the
    // "couldn't confirm" state with this placeholder key, which is fine: these tests check the page,
    // not the live database.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://qiitpirpnqaonnzmdmhc.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "e2e-placeholder-publishable-key",
    },
  },
});
