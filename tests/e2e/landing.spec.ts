import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and displays hero section", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=PropLead AI")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    const propertiesLink = page.getByRole("link", { name: /properties/i });
    if (await propertiesLink.isVisible()) {
      await propertiesLink.click();
      await expect(page).toHaveURL(/\/properties/);
    }
  });
});
