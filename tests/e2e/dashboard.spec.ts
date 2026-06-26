import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/sign-in/);
  });

  test("shows sign-in page with clerk UI", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.locator("body")).toBeVisible();
  });
});
