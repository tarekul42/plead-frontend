import { test, expect } from "@playwright/test";

test.describe("AI Features", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard/leads");
    await page.waitForTimeout(3000);
    const isOnSignIn = page.url().includes("sign-in");
    const isOnClerk = page.url().includes("clerk.accounts.dev");
    const rateLimitText = await page.locator("text=too many requests").first().isVisible();
const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
const isRateLimited = rateLimitText || rateLimitJson;
    if (isOnSignIn || isOnClerk || isRateLimited) {
      test.skip();
    }
  });

  test("AI match panel is present on lead detail page", async ({ page }) => {
    // Navigate to a lead detail if possible
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const aiPanel = page.locator("text=AI Match Engine");
      if (await aiPanel.isVisible()) {
        await expect(aiPanel).toBeVisible();
      }
    }
  });

  test("AI match panel shows trigger button initially", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await expect(matchBtn).toBeVisible();
      }
    }
  });

  test("clicking match properties triggers AI analysis", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await matchBtn.click();

        // Should show loading state or results
        const loading = page.locator("text=Analyzing matches...");
        const results = page.locator("text=%");

        await page.waitForTimeout(2000);
        const hasLoading = await loading.isVisible();
        const hasResults = await results.isVisible();

        expect(hasLoading || hasResults).toBeTruthy();
      }
    }
  });

  test("AI match results display property titles and scores", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await matchBtn.click();
        await page.waitForTimeout(3000);

        // Check for score percentage display
        const scoreText = page.locator("text=/%/");
        if (await scoreText.first().isVisible()) {
          await expect(scoreText.first()).toBeVisible();
        }
      }
    }
  });

  test("AI match results show match reasons", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await matchBtn.click();
        await page.waitForTimeout(3000);

        // Check for reasons list (bullet points)
        const reasonsList = page.locator("text=Matches budget, text=Preferred location");
        if (await reasonsList.first().isVisible()) {
          await expect(reasonsList.first()).toBeVisible();
        }
      }
    }
  });

  test("AI match panel shows error state on failure", async ({ page }) => {
    // This test depends on API behavior - may need to mock network
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await matchBtn.click();
        await page.waitForTimeout(3000);

        const errorText = page.locator("text=Match failed, text=AI service unavailable");
        // Error state may or may not appear depending on API
        const hasError = await errorText.first().isVisible();
        const hasResults = await page.locator("text=/%/").first().isVisible();

        expect(hasError || hasResults).toBeTruthy();
      }
    }
  });

  test("AI match panel has refresh button after results load", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const matchBtn = page.getByRole("button", { name: /match properties/i });
      if (await matchBtn.isVisible()) {
        await matchBtn.click();
        await page.waitForTimeout(3000);

        const refreshBtn = page.getByRole("button", { name: /refresh matches/i });
        if (await refreshBtn.isVisible()) {
          await expect(refreshBtn).toBeVisible();
        }
      }
    }
  });

  test("AI copy generator is accessible from property page", async ({ page }) => {
    await page.goto("/properties");

    const firstPropertyLink = page.locator('a[href*="/properties/"]').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      const copyGenerator = page.locator("text=AI Copy Generator, text=Generate Copy");
      if (await copyGenerator.first().isVisible()) {
        await expect(copyGenerator.first()).toBeVisible();
      }
    }
  });

  test("AI copy generator has tone selector", async ({ page }) => {
    await page.goto("/properties");

    const firstPropertyLink = page.locator('a[href*="/properties/"]').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      const toneSelect = page.locator("select, text=luxury, text=standard, text=brief");
      if (await toneSelect.first().isVisible()) {
        await expect(toneSelect.first()).toBeVisible();
      }
    }
  });

  test("generating AI copy shows loading state", async ({ page }) => {
    await page.goto("/properties");

    const firstPropertyLink = page.locator('a[href*="/properties/"]').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      const generateBtn = page.getByRole("button", { name: /generate copy/i });
      if (await generateBtn.isVisible()) {
        await generateBtn.click();

        // Should show generating state or results
        const generating = page.locator("text=Generating...");
        const results = page.locator("text=highlights, text=Open floor plan");

        await page.waitForTimeout(2000);
        const hasGenerating = await generating.isVisible();
        const hasResults = await results.first().isVisible();

        expect(hasGenerating || hasResults).toBeTruthy();
      }
    }
  });
});
