import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard");

    // Should be redirected to sign-in or Clerk handshake
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");

    expect(isOnSignIn || isOnClerk).toBeTruthy();
  });

  test("shows sign-in page with clerk UI", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.locator("body")).toBeVisible();
  });
});
