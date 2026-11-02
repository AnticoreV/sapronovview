import { defineConfig } from "@playwright/test";

/**
 * Smoke tests against the production build (`npm run test:e2e` builds first).
 * Two projects: desktop 1440 and a 375px touch phone.
 * CHROMIUM_PATH points at another Chromium binary if the bundled one is missing.
 */
const PORT = 4322;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
  },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile-375",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
