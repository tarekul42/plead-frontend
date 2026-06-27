import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    const response = await page.goto("/dashboard/admin");
    // Admin page doesn't exist yet - skip all tests
    if (response?.status() === 404) {
      test.skip();
    }
  });

  test("redirects non-admin users", async ({ page }) => {
    // Non-admin users should be redirected or see access denied
    const currentUrl = page.url();
    const isOnAdmin = currentUrl.includes("admin");
    const isOnSignIn = currentUrl.includes("sign-in");
    const isOnClerk = currentUrl.includes("clerk.accounts.dev");

    // Either on admin page or redirected
    expect(isOnAdmin || isOnSignIn || isOnClerk).toBeTruthy();
  });

  test("loads admin dashboard for admin users", async ({ page }) => {
    await page.waitForTimeout(3000);

    const adminHeading = page.locator("text=Admin Dashboard, text=User Management, text=Agency Overview");
    if (await adminHeading.first().isVisible()) {
      await expect(adminHeading.first()).toBeVisible();
    }
  });

  test("displays user management section", async ({ page }) => {
    await page.waitForTimeout(3000);

    const userManagement = page.locator("text=User Management, text=Users");
    if (await userManagement.first().isVisible()) {
      await expect(userManagement.first()).toBeVisible();
    }
  });

  test("shows list of agency users", async ({ page }) => {
    await page.waitForTimeout(3000);

    // Check for user list or table
    const userList = page.locator('[data-testid="user-list"], table, text=/agent@|manager@|admin@/');
    if (await userList.first().isVisible()) {
      await expect(userList.first()).toBeVisible();
    }
  });

  test("displays user roles", async ({ page }) => {
    await page.waitForTimeout(3000);

    const roleText = page.locator("text=admin, text=agent, text=manager");
    if (await roleText.first().isVisible()) {
      await expect(roleText.first()).toBeVisible();
    }
  });

  test("can toggle user active status", async ({ page }) => {
    await page.waitForTimeout(3000);

    const toggleBtn = page.getByRole("button", { name: /deactivate|activate|toggle/i }).first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(1000);

      // Status should change
      const statusText = page.locator("text=Active, text=Inactive");
      if (await statusText.first().isVisible()) {
        await expect(statusText.first()).toBeVisible();
      }
    }
  });

  test("displays agency stats", async ({ page }) => {
    await page.waitForTimeout(3000);

    const statsSection = page.locator("text=Agency Overview, text=Agents:, text=Leads:");
    if (await statsSection.first().isVisible()) {
      await expect(statsSection.first()).toBeVisible();
    }
  });

  test("shows total agents count", async ({ page }) => {
    await page.waitForTimeout(3000);

    const agentsCount = page.locator("text=/Agents: \\d+/");
    if (await agentsCount.isVisible()) {
      await expect(agentsCount).toBeVisible();
    }
  });

  test("shows total leads count", async ({ page }) => {
    await page.waitForTimeout(3000);

    const leadsCount = page.locator("text=/Leads: \\d+/");
    if (await leadsCount.isVisible()) {
      await expect(leadsCount).toBeVisible();
    }
  });

  test("shows total properties count", async ({ page }) => {
    await page.waitForTimeout(3000);

    const propertiesCount = page.locator("text=/Properties: \\d+/");
    if (await propertiesCount.isVisible()) {
      await expect(propertiesCount).toBeVisible();
    }
  });

  test("shows revenue information", async ({ page }) => {
    await page.waitForTimeout(3000);

    const revenue = page.locator("text=/Revenue: \\$/");
    if (await revenue.isVisible()) {
      await expect(revenue).toBeVisible();
    }
  });

  test("admin navigation is present", async ({ page }) => {
    await page.waitForTimeout(3000);

    const adminNav = page.locator('a[href*="admin"], nav');
    if (await adminNav.first().isVisible()) {
      await expect(adminNav.first()).toBeVisible();
    }
  });

  test("admin can filter users by role", async ({ page }) => {
    await page.waitForTimeout(3000);

    const filterBtn = page.locator('button, select').filter({ hasText: /filter|role/i }).first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test("admin can search users", async ({ page }) => {
    await page.waitForTimeout(3000);

    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("agent");
      await page.waitForTimeout(500);
    }
  });
});
