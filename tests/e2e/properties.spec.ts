import { test, expect } from "@playwright/test";

test.describe("Properties listing", () => {
  test("displays property cards", async ({ page }) => {
    await page.goto("/properties");

    await expect(page.locator("h1")).toBeVisible();
  });

  test("search input is present", async ({ page }) => {
    await page.goto("/properties");

    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });
});
