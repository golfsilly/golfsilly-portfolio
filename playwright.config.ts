import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".cache/playwright");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 45_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
