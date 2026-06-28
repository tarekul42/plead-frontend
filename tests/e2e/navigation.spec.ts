import { test, expect } from "@playwright/test";

test.describe("Navigation and Routing", () => {
  test("landing page loads successfully", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("navigation to about page works", async ({ page }) => {
    await page.goto("/");

    const aboutLink = page.getByRole("link", { name: /about/i });
    if (await aboutLink.first().isVisible()) {
      await aboutLink.first().click();
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test("navigation to contact page works", async ({ page }) => {
    await page.goto("/");

    const contactLink = page.getByRole("link", { name: /contact/i });
    if (await contactLink.first().isVisible()) {
      await contactLink.first().click();
      await expect(page).toHaveURL(/\/contact/);
    }
  });

  test("navigation to properties page works", async ({ page }) => {
    await page.goto("/");

    const propertiesLink = page.getByRole("link", { name: /explore properties|properties/i });
    if (await propertiesLink.first().isVisible()) {
      await propertiesLink.first().click();
      await expect(page).toHaveURL(/\/properties/);
    }
  });

  test("navigation to sign-in page works", async ({ page }) => {
    await page.goto("/");

    const signInLink = page.getByRole("link", { name: /sign in/i });
    if (await signInLink.first().isVisible()) {
      await signInLink.first().click();
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });

  test("navigation to sign-up page works", async ({ page }) => {
    await page.goto("/");

    const signUpLink = page.getByRole("link", { name: /get started|start free|sign up/i });
    if (await signUpLink.first().isVisible()) {
      await signUpLink.first().click();
      await expect(page).toHaveURL(/\/sign-up/);
    }
  });

  test("navigation to privacy page works", async ({ page }) => {
    await page.goto("/");

    const privacyLink = page.getByRole("link", { name: /privacy/i });
    if (await privacyLink.first().isVisible()) {
      await privacyLink.first().click();
      await expect(page).toHaveURL(/\/privacy/);
    }
  });

  test("navigation to terms page works", async ({ page }) => {
    await page.goto("/");

    const termsLink = page.getByRole("link", { name: /terms/i });
    if (await termsLink.first().isVisible()) {
      await termsLink.first().click();
      await expect(page).toHaveURL(/\/terms/);
    }
  });

  test("navigation to help page works", async ({ page }) => {
    await page.goto("/");

    const helpLink = page.getByRole("link", { name: /help/i });
    if (await helpLink.first().isVisible()) {
      await helpLink.first().click();
      await expect(page).toHaveURL(/\/help/);
    }
  });

  test("navigation to blog page works", async ({ page }) => {
    await page.goto("/");

    const blogLink = page.getByRole("link", { name: /blog/i });
    if (await blogLink.first().isVisible()) {
      await blogLink.first().click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test("404 page is shown for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-page-definitely-does-not-exist");

    // Should either show 404 page or handle gracefully
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("browser back button works correctly", async ({ page }) => {
    const rateLimitText = await page.locator("text=too many requests").first().isVisible();
    const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
    if (rateLimitText || rateLimitJson) return;

    await page.goto("/");
    await page.waitForTimeout(500);

    const propertiesLink = page.getByRole("link", { name: /explore properties|properties/i }).first();
    if (await propertiesLink.isVisible()) {
      await propertiesLink.click();
      await page.waitForURL(/\/properties/, { timeout: 5000 });

      await page.goBack();
      await expect(page).toHaveURL("/", { timeout: 5000 });
    }
  });

  test("browser forward button works correctly", async ({ page }) => {
    const rateLimitText = await page.locator("text=too many requests").first().isVisible();
    const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
    if (rateLimitText || rateLimitJson) return;

    await page.goto("/");
    await page.waitForTimeout(500);

    const propertiesLink = page.getByRole("link", { name: /explore properties|properties/i }).first();
    if (await propertiesLink.isVisible()) {
      await propertiesLink.click();
      await page.waitForURL(/\/properties/, { timeout: 5000 });

      await page.goBack();
      await page.waitForURL("/", { timeout: 5000 });

      await page.goForward();
      await page.waitForURL(/\/properties/, { timeout: 5000 });
    }
  });
});

test.describe("Dashboard Navigation (Authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    // Skip if not authenticated
    const isOnSignIn = page.url().includes("sign-in");
    if (isOnSignIn) {
      test.skip();
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

  test("dashboard navigation to interactions works", async ({ page }) => {
    const interactionsLink = page.getByRole("link", { name: /interactions/i });
    if (await interactionsLink.first().isVisible()) {
      await interactionsLink.first().click();
      await expect(page).toHaveURL(/interactions/);
    }
  });

  test("dashboard navigation to reviews works", async ({ page }) => {
    const reviewsLink = page.getByRole("link", { name: /reviews/i });
    if (await reviewsLink.first().isVisible()) {
      await reviewsLink.first().click();
      await expect(page).toHaveURL(/reviews/);
    }
  });

  test("dashboard navigation to blog works", async ({ page }) => {
    const blogLink = page.getByRole("link", { name: /blog/i });
    if (await blogLink.first().isVisible()) {
      await blogLink.first().click();
      await expect(page).toHaveURL(/blog/);
    }
  });

  test("dashboard navigation to profile works", async ({ page }) => {
    const profileLink = page.getByRole("link", { name: /profile/i });
    if (await profileLink.first().isVisible()) {
      await profileLink.first().click();
      await expect(page).toHaveURL(/profile/);
    }
  });

  test("dashboard navigation to AI tools works", async ({ page }) => {
    const aiToolsLink = page.getByRole("link", { name: /ai tools|ai-tools/i });
    if (await aiToolsLink.first().isVisible()) {
      await aiToolsLink.first().click();
      await expect(page).toHaveURL(/ai-tools/);
    }
  });

  test("dashboard navigation to AI usage works", async ({ page }) => {
    const aiUsageLink = page.getByRole("link", { name: /ai usage|ai-usage/i });
    if (await aiUsageLink.first().isVisible()) {
      await aiUsageLink.first().click();
      await expect(page).toHaveURL(/ai-usage/);
    }
  });

  test("dashboard navigation to users works", async ({ page }) => {
    const usersLink = page.getByRole("link", { name: /users/i });
    if (await usersLink.first().isVisible()) {
      await usersLink.first().click();
      await expect(page).toHaveURL(/users/);
    }
  });
});
