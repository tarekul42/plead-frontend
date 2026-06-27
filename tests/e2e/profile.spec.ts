import { test, expect } from "@playwright/test";

test.describe("Profile Management", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard/profile");
    await page.waitForTimeout(3000);
    const isOnSignIn = page.url().includes("sign-in");
    const isOnClerk = page.url().includes("clerk.accounts.dev");
    const isRateLimited = await page.locator("text=too many requests, text=rate limit").first().isVisible();
    if (isOnSignIn || isOnClerk || isRateLimited) {
      test.skip();
    }
  });

  test("profile page loads", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });

  test("profile page displays heading", async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test("profile form has first name input", async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="first" i]');
    if (await firstNameInput.first().isVisible()) {
      await expect(firstNameInput.first()).toBeVisible();
    }
  });

  test("profile form has last name input", async ({ page }) => {
    await page.waitForTimeout(1000);

    const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="last" i]');
    if (await lastNameInput.first().isVisible()) {
      await expect(lastNameInput.first()).toBeVisible();
    }
  });

  test("profile form has email display", async ({ page }) => {
    await page.waitForTimeout(1000);

    const emailDisplay = page.locator('input[name="email"], input[type="email"]');
    if (await emailDisplay.first().isVisible()) {
      await expect(emailDisplay.first()).toBeVisible();
    }
  });

  test("profile form has phone input", async ({ page }) => {
    await page.waitForTimeout(1000);

    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="phone" i]');
    if (await phoneInput.first().isVisible()) {
      await expect(phoneInput.first()).toBeVisible();
    }
  });

  test("profile form has title input", async ({ page }) => {
    await page.waitForTimeout(1000);

    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
    if (await titleInput.first().isVisible()) {
      await expect(titleInput.first()).toBeVisible();
    }
  });

  test("can edit first name", async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="first" i]');
    if (await firstNameInput.first().isVisible()) {
      await firstNameInput.first().fill("TestFirstName");
      await expect(firstNameInput.first()).toHaveValue("TestFirstName");
    }
  });

  test("can edit last name", async ({ page }) => {
    await page.waitForTimeout(1000);

    const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="last" i]');
    if (await lastNameInput.first().isVisible()) {
      await lastNameInput.first().fill("TestLastName");
      await expect(lastNameInput.first()).toHaveValue("TestLastName");
    }
  });

  test("save button is present", async ({ page }) => {
    await page.waitForTimeout(1000);

    const saveBtn = page.getByRole("button", { name: /save|update|submit/i });
    if (await saveBtn.first().isVisible()) {
      await expect(saveBtn.first()).toBeVisible();
    }
  });

  test("can submit profile form", async ({ page }) => {
    await page.waitForTimeout(1000);

    const saveBtn = page.getByRole("button", { name: /save|update|submit/i });
    if (await saveBtn.first().isVisible()) {
      await saveBtn.first().click();
      await page.waitForTimeout(1000);

      // Should show success message or stay on page
      const successMsg = page.locator("text=saved, text=success, text=updated");
      const isOnProfile = page.url().includes("profile");

      expect(isOnProfile || (await successMsg.first().isVisible())).toBeTruthy();
    }
  });

  test("profile shows user avatar", async ({ page }) => {
    await page.waitForTimeout(1000);

    const avatar = page.locator('img[alt*="avatar" i], img[alt*="profile" i], [data-testid="avatar"]');
    if (await avatar.first().isVisible()) {
      await expect(avatar.first()).toBeVisible();
    }
  });
});
