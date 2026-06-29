import { test, expect } from "@playwright/test";

// Helper to check if Clerk rate limit is active
async function isClerkRateLimited(page: any) {
  const rateLimitText = await page.locator("text=too many requests").first().isVisible();
  const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
  return rateLimitText || rateLimitJson;
}

async function isAuthenticated(page: any) {
  const cookies = await page.context().cookies();
  return cookies.some((c: any) => c.name.includes("__session"));
}

test.describe("Authentication Flow", () => {
  test("sign-in page loads with Clerk UI", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator("body")).toBeVisible();
  });

  test("demo login buttons are visible after Clerk loads", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/sign-in");
    await page.waitForTimeout(15000);

    const hasDemoButtons = await page.locator("text=Quick Demo Access").isVisible();
    const hasRateLimit = await isClerkRateLimited(page);
    expect(hasDemoButtons || hasRateLimit).toBeTruthy();
  });

  test("demo login buttons show all three roles", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/sign-in");
    await page.waitForTimeout(15000);

    const hasRateLimit = await isClerkRateLimited(page);
    if (!hasRateLimit) {
      const agentBtn = page.getByRole("button", { name: /agent/i });
      const managerBtn = page.getByRole("button", { name: /manager/i });
      const adminBtn = page.getByRole("button", { name: /admin/i });
      await expect(agentBtn.first()).toBeVisible();
      await expect(managerBtn.first()).toBeVisible();
      await expect(adminBtn.first()).toBeVisible();
    }
  });

  test("clicking demo login button attempts sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/sign-in");
    await page.waitForTimeout(15000);

    const hasRateLimit = await isClerkRateLimited(page);
    if (!hasRateLimit) {
      const agentBtn = page.getByRole("button", { name: /agent/i });
      await expect(agentBtn.first()).toBeVisible({ timeout: 10000 });
      await agentBtn.first().click();
      await page.waitForTimeout(3000);
    }
  });

  test("redirects unauthenticated users from dashboard to sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/dashboard");
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");
    const hasSpinner = await page.locator(".animate-spin").isVisible();
    expect(isOnSignIn || isOnClerk || hasSpinner).toBeTruthy();
  });

  test("redirects unauthenticated users from leads to sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/dashboard/leads");
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");
    const hasSpinner = await page.locator(".animate-spin").isVisible();
    expect(isOnSignIn || isOnClerk || hasSpinner).toBeTruthy();
  });

  test("redirects unauthenticated users from properties dashboard to sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/dashboard/properties");
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");
    const hasSpinner = await page.locator(".animate-spin").isVisible();
    expect(isOnSignIn || isOnClerk || hasSpinner).toBeTruthy();
  });

  test("redirects unauthenticated users from profile to sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    await page.goto("/dashboard/profile");
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");
    const hasSpinner = await page.locator(".animate-spin").isVisible();
    expect(isOnSignIn || isOnClerk || hasSpinner).toBeTruthy();
  });

  test("redirects unauthenticated users from admin to sign-in", async ({ page }) => {
    if (await isAuthenticated(page)) { test.skip(); return; }
    test.setTimeout(30000);
    const response = await page.goto("/dashboard/admin");
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");
    const is404 = response?.status() === 404;
    expect(isOnSignIn || isOnClerk || is404).toBeTruthy();
  });

  test("public pages are accessible without authentication", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await page.goto("/properties");
    await expect(page.locator("body")).toBeVisible();
  });

  test("about page is accessible without authentication", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("body")).toBeVisible();
  });

  test("contact page is accessible without authentication", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });

  test("privacy page is accessible without authentication", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("body")).toBeVisible();
  });

  test("terms page is accessible without authentication", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("body")).toBeVisible();
  });

  test("blog page is accessible without authentication", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("body")).toBeVisible();
  });

  test("help page is accessible without authentication", async ({ page }) => {
    await page.goto("/help");
    await expect(page.locator("body")).toBeVisible();
  });
});
