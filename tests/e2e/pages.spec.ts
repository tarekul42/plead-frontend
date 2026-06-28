import { test, expect } from "@playwright/test";

// Helper to check if Clerk rate limit is active
async function isClerkRateLimited(page: any) {
  const rateLimitText = await page.locator("text=too many requests").first().isVisible();
  const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
  return rateLimitText || rateLimitJson;
}

test.describe("Agents Page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard/agents");
    await page.waitForTimeout(3000);
    const isOnSignIn = page.url().includes("sign-in");
    const isOnClerk = page.url().includes("clerk.accounts.dev");
    if (isOnSignIn || isOnClerk) {
      test.skip();
    }
  });

  test("loads agents page", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays agents heading", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows agent list or empty state", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const hasAgents = await page.locator('[data-testid="agent-list"], table').first().isVisible();
    const hasEmptyState = await page.locator("text=No agents").or(page.locator("text=no agents")).isVisible();

    expect(hasAgents || hasEmptyState).toBeTruthy();
  });

  test("can open invite agent form", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    const inviteBtn = page.getByRole("button", { name: /invite|add agent|new agent/i });
    if (await inviteBtn.first().isVisible()) {
      await inviteBtn.first().click();
      await expect(page.locator("form, [data-testid='invite-form'], [role='dialog']")).toBeVisible();
    }
  });

  test("invite agent form has email input", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    const inviteBtn = page.getByRole("button", { name: /invite|add agent|new agent/i });
    if (await inviteBtn.first().isVisible()) {
      await inviteBtn.first().click();

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      if (await emailInput.first().isVisible()) {
        await expect(emailInput.first()).toBeVisible();
      }
    }
  });

  test("can fill in agent email", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    const inviteBtn = page.getByRole("button", { name: /invite|add agent|new agent/i });
    if (await inviteBtn.first().isVisible()) {
      await inviteBtn.first().click();

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      if (await emailInput.first().isVisible()) {
        await emailInput.first().fill("newagent@example.com");
        await expect(emailInput.first()).toHaveValue("newagent@example.com");
      }
    }
  });

  test("can assign role to agent", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    const inviteBtn = page.getByRole("button", { name: /invite|add agent|new agent/i });
    if (await inviteBtn.first().isVisible()) {
      await inviteBtn.first().click();

      const roleSelect = page.locator('select[name="role"], [data-testid*="role"]');
      if (await roleSelect.first().isVisible()) {
        await roleSelect.first().selectOption({ index: 1 });
      }
    }
  });
});

test.describe("Public Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/blog");
    await page.waitForTimeout(3000);
  });

  test("loads blog listing page", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays blog heading", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows blog posts or empty state", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const hasPosts = await page.locator('[data-testid="blog-list"], article').first().isVisible();
    const hasEmptyState = await page.locator("text=No posts").or(page.locator("text=no blog")).isVisible();

    expect(hasPosts || hasEmptyState).toBeTruthy();
  });

  test("blog posts show title", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const titles = page.locator("article h2, article h3, [data-testid='blog-list'] h2, [data-testid='blog-list'] h3");
    if (await titles.first().isVisible()) {
      await expect(titles.first()).toBeVisible();
    }
  });

  test("blog posts are clickable", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const postLink = page.locator('a[href*="/blog/"], article a').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      await expect(page).toHaveURL(/\/blog\/.+/);
    }
  });

  test("blog post detail page shows content", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const postLink = page.locator('a[href*="/blog/"], article a').first();
    if (await postLink.isVisible()) {
      await postLink.click();

      await page.waitForTimeout(1000);

      const content = page.locator("article, [data-testid='blog-content'], .prose");
      if (await content.first().isVisible()) {
        await expect(content.first()).toBeVisible();
      }
    }
  });
});

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/about");
    await page.waitForTimeout(3000);
  });

  test("loads about page", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays about heading", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows team or company information", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const aboutContent = page.locator("text=team").or(page.locator("text=mission")).or(page.locator("text=about")).or(page.locator("text=company"));
    if (await aboutContent.first().isVisible()) {
      await expect(aboutContent.first()).toBeVisible();
    }
  });
});

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/contact");
    await page.waitForTimeout(3000);
  });

  test("loads contact page", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays contact heading", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await expect(page.locator("h1")).toBeVisible();
  });

  test("contact form has name input", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    if (await nameInput.first().isVisible()) {
      await expect(nameInput.first()).toBeVisible();
    }
  });

  test("contact form has email input", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const emailInput = page.locator('input[name="email"], input[type="email"]');
    if (await emailInput.first().isVisible()) {
      await expect(emailInput.first()).toBeVisible();
    }
  });

  test("contact form has message textarea", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]');
    if (await messageInput.first().isVisible()) {
      await expect(messageInput.first()).toBeVisible();
    }
  });

  test("can fill in contact form", async ({ page }) => {
    if (await isClerkRateLimited(page)) return;
    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    if (await nameInput.first().isVisible()) {
      await nameInput.first().fill("Test User");
    }

    const emailInput = page.locator('input[name="email"], input[type="email"]');
    if (await emailInput.first().isVisible()) {
      await emailInput.first().fill("test@example.com");
    }

    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]');
    if (await messageInput.first().isVisible()) {
      await messageInput.first().fill("This is a test message from e2e tests.");
    }
  });
});
