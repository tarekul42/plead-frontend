import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        storageState: ".auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: [
    {
      command: "bun run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: "node dist/server.js",
      cwd: "../plead-backend",
      url: "http://localhost:5000/",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
