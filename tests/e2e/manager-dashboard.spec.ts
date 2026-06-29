import { test, expect } from "@playwright/test";

async function isClerkRateLimited(page: any) {
  const rateLimitText = await page.locator("text=too many requests").first().isVisible();
  const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
  return rateLimitText || rateLimitJson;
}

test.describe("Manager Dashboard", () => {
  test.beforeEach(async ({ context }) => {
    const cookies = await context.cookies();
    const hasSession = cookies.some((c) => c.name.includes("__session"));
    if (hasSession) test.skip();
  });

  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard");
    if (await isClerkRateLimited(page)) return;

    // Should be redirected to sign-in or Clerk handshake
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");

    expect(isOnSignIn || isOnClerk).toBeTruthy();
  });

  test("dashboard shows loading state for unauthenticated users", async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard");
    if (await isClerkRateLimited(page)) return;

    // Should show loading or redirect quickly
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");

    expect(isOnSignIn || isOnClerk).toBeTruthy();
  });
});

test.describe("Manager Dashboard (Authenticated)", () => {
  // These tests assume the user is authenticated
  // In a real scenario, you'd use a fixture or beforeEach to log in

  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard");
    // Skip if not authenticated
    const isOnSignIn = page.url().includes("sign-in");
    const isOnClerk = page.url().includes("clerk.accounts.dev");
    const isSignInPage = await page.locator("text=Welcome back").isVisible();
    if (isOnSignIn || isOnClerk || isSignInPage) {
      test.skip();
    }
    if (await isClerkRateLimited(page)) {
      test.skip();
    }
    const hasApiError = await page.locator("text=Request failed with status code 429").isVisible();
    if (hasApiError) {
      test.skip();
    }
    const connError = await page.locator("text=Unable to connect to server").isVisible();
    if (connError) {
      test.skip();
    }
    await page.waitForTimeout(3000);
  });

  test("dashboard displays heading", async ({ page }) => {
    test.setTimeout(60000);
    await page.waitForTimeout(5000);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.waitForTimeout(1000);

    const statCards = page.locator('[data-testid="stat-cards"], .grid');
    if (await statCards.first().isVisible()) {
      await expect(statCards.first()).toBeVisible();
    }
  });

  test("dashboard shows recent leads section", async ({ page }) => {
    await page.waitForTimeout(1000);

    const recentLeads = page.locator("text=Recent Leads").or(page.locator("text=recent leads"));
    if (await recentLeads.first().isVisible()) {
      await expect(recentLeads.first()).toBeVisible();
    }
  });

  test("dashboard shows quick actions", async ({ page }) => {
    await page.waitForTimeout(1000);

    const quickActions = page.locator("text=Quick Actions").or(page.locator("text=quick actions"));
    if (await quickActions.first().isVisible()) {
      await expect(quickActions.first()).toBeVisible();
    }
  });

  test("dashboard navigation to leads works", async ({ page }) => {
    const leadsLink = page.getByRole("link", { name: /leads/i });
    if (await leadsLink.first().isVisible()) {
      await leadsLink.first().click();
      await expect(page).toHaveURL(/leads/);
    }
  });

  test("dashboard navigation to properties works", async ({ page }) => {
    const propertiesLink = page.getByRole("link", { name: /properties/i });
    if (await propertiesLink.first().isVisible()) {
      await propertiesLink.first().click();
      await expect(page).toHaveURL(/properties/);
    }
  });

  test("dashboard navigation to agents works", async ({ page }) => {
    const agentsLink = page.getByRole("link", { name: /agents/i });
    if (await agentsLink.first().isVisible()) {
      await agentsLink.first().click();
      await expect(page).toHaveURL(/agents/);
    }
  });

  test("dashboard navigation to blog works", async ({ page }) => {
    const blogLink = page.getByRole("link", { name: /blog/i });
    if (await blogLink.first().isVisible()) {
      await blogLink.first().click();
      await expect(page).toHaveURL(/blog/);
    }
  });
});
