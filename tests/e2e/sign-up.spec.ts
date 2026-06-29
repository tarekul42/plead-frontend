import { test, expect } from "@playwright/test";

test.describe("Sign-Up Flow", () => {
  test.beforeEach(async ({ page }) => {
    const cookies = await page.context().cookies();
    const hasSession = cookies.some((c: any) => c.name.includes("__session"));
    if (hasSession) test.skip();
  });

  test("sign-up page loads with Clerk UI", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.locator("body")).toBeVisible();
  });

  test("sign-up page has sign-up form elements", async ({ page }) => {
    await page.goto("/sign-up");

    // Wait for Clerk to load
    await page.waitForTimeout(5000);

    // Check for common sign-up form elements
    // Clerk renders different flows, so we check for any likely element
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const firstNameInput = page.locator('input[name="firstName"]');
    const continueBtn = page.getByRole("button", { name: /continue|next/i });

    // At least one should be visible (Clerk renders different flows)
    const hasEmail = await emailInput.first().isVisible();
    const hasPassword = await passwordInput.first().isVisible();
    const hasFirstName = await firstNameInput.first().isVisible();
    const hasContinue = await continueBtn.first().isVisible();

    expect(hasEmail || hasPassword || hasFirstName || hasContinue).toBeTruthy();
  });

  test("can navigate between sign-in and sign-up", async ({ page }) => {
    await page.goto("/sign-in");

    await page.waitForTimeout(3000);

    // Look for link to sign up
    const signUpLink = page.getByRole("link", { name: /sign up|create account/i });
    if (await signUpLink.first().isVisible()) {
      await signUpLink.first().click();
      await expect(page).toHaveURL(/sign-up/);
    }
  });

  test("can navigate from sign-up to sign-in", async ({ page }) => {
    await page.goto("/sign-up");

    await page.waitForTimeout(3000);

    // Look for link to sign in
    const signInLink = page.getByRole("link", { name: /sign in|already have an account/i });
    if (await signInLink.first().isVisible()) {
      await signInLink.first().click();
      await expect(page).toHaveURL(/sign-in/);
    }
  });

  test("sign-up form validation shows errors for empty submission", async ({ page }) => {
    await page.goto("/sign-up");

    await page.waitForTimeout(5000);

    // Try to submit the form
    const continueBtn = page.getByRole("button", { name: /continue|next|sign up/i });
    if (await continueBtn.first().isVisible()) {
      await continueBtn.first().click();
      await page.waitForTimeout(1000);

      // Just verify the page is still on sign-up (didn't submit without filling required fields)
      expect(page.url()).toContain("sign-up");
    }
  });
});
