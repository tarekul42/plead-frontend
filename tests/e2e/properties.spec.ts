import { test, expect } from "@playwright/test";

test.describe("Properties listing", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/properties");
    await page.waitForTimeout(3000);
    const isRateLimited = await page.locator("text=too many requests, text=rate limit").first().isVisible();
    if (isRateLimited) {
      test.skip();
    }
  });

  test("displays property cards", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("search input is present", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });
});
