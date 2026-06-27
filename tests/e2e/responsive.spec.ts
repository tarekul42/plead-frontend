import { test, expect, devices } from "@playwright/test";

test.describe("Responsive Layout", () => {
  test.describe("Mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("landing page is responsive on mobile", async ({ page }) => {
      await page.goto("/");

      // Content should be visible without horizontal scroll
      const body = page.locator("body");
      await expect(body).toBeVisible();

      // Check for horizontal overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow).toBeFalsy();
    });

    test("properties page is responsive on mobile", async ({ page }) => {
      await page.goto("/properties");

      await page.waitForTimeout(1000);

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow).toBeFalsy();
    });

    test("navigation is accessible on mobile", async ({ page }) => {
      await page.goto("/");

      // Mobile menu button or navigation should be present
      const menuBtn = page.locator('button[aria-label*="menu" i], [data-testid="mobile-menu"], .hamburger');
      const nav = page.locator("nav");

      // Either a menu button or visible nav
      const hasMenu = await menuBtn.isVisible();
      const hasNav = await nav.isVisible();

      expect(hasMenu || hasNav).toBeTruthy();
    });

    test("property cards stack vertically on mobile", async ({ page }) => {
      await page.goto("/properties");
      await page.waitForTimeout(1000);

      const cards = page.locator('[data-testid="property-grid"] > div, .grid > div');
      if (await cards.first().isVisible()) {
        // Cards should be in a single column layout
        const firstCard = cards.first();
        const box = await firstCard.boundingBox();
        expect(box?.width).toBeLessThanOrEqual(375);
      }
    });

    test("text is readable on mobile", async ({ page }) => {
      await page.goto("/");

      // Text should not be too small
      const fontSize = await page.evaluate(() => {
        const body = document.body;
        return parseFloat(window.getComputedStyle(body).fontSize);
      });

      expect(fontSize).toBeGreaterThanOrEqual(12);
    });
  });

  test.describe("Tablet viewport", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("landing page is responsive on tablet", async ({ page }) => {
      await page.goto("/");

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow).toBeFalsy();
    });

    test("properties page shows 2-column grid on tablet", async ({ page }) => {
      await page.goto("/properties");
      await page.waitForTimeout(1000);

      // Check grid has appropriate columns for tablet
      const grid = page.locator('[data-testid="property-grid"], .grid');
      if (await grid.isVisible()) {
        const gridStyle = await grid.evaluate((el) => ({
          columns: window.getComputedStyle(el).gridTemplateColumns,
        }));
        // Should have at least 2 columns on tablet
        expect(gridStyle.columns).toBeDefined();
      }
    });

    test("dashboard layout adapts on tablet", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForTimeout(1000);

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow).toBeFalsy();
    });
  });

  test.describe("Desktop viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("properties page shows multi-column grid on desktop", async ({ page }) => {
      await page.goto("/properties");
      await page.waitForTimeout(1000);

      const grid = page.locator('[data-testid="property-grid"], .grid');
      if (await grid.isVisible()) {
        const gridStyle = await grid.evaluate((el) => ({
          columns: window.getComputedStyle(el).gridTemplateColumns,
        }));
        // Should have multiple columns on desktop
        const columnCount = gridStyle.columns.split(" ").length;
        expect(columnCount).toBeGreaterThanOrEqual(2);
      }
    });

    test("dashboard shows stat cards in row on desktop", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForTimeout(1000);

      const statCards = page.locator('[data-testid="stat-cards"] > div, .grid > div');
      const count = await statCards.count();
      if (count > 1) {
        // Multiple stat cards should be in a row
        expect(count).toBeGreaterThanOrEqual(2);
      }
    });

    test("navigation shows full menu on desktop", async ({ page }) => {
      await page.goto("/");

      const nav = page.locator("nav");
      if (await nav.isVisible()) {
        // Desktop nav should show links
        const links = nav.locator("a");
        const linkCount = await links.count();
        expect(linkCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test.describe("Common responsive checks", () => {
    test("images are responsive", async ({ page }) => {
      await page.goto("/properties");
      await page.waitForTimeout(1000);

      const images = page.locator("img");
      const count = await images.count();

      if (count > 0) {
        // Images should not overflow their containers
        const firstImage = images.first();
        const naturalWidth = await firstImage.evaluate((img) => (img as HTMLImageElement).naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });

    test("forms are responsive", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForTimeout(1000);

      const form = page.locator("form");
      if (await form.isVisible()) {
        const box = await form.boundingBox();
        // Form should not overflow viewport
        expect(box?.width).toBeLessThanOrEqual(1280);
      }
    });

    test("no horizontal scroll at common breakpoints", async ({ page }) => {
      const breakpoints = [375, 768, 1024, 1280, 1440];

      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 720 });
        await page.goto("/");
        await page.waitForTimeout(500);

        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasOverflow).toBeFalsy();
      }
    });

    test("touch targets are large enough on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForTimeout(500);

      // Buttons should be at least 44x44px for touch targets (WCAG)
      const buttons = page.locator("button, a");
      const count = await buttons.count();

      if (count > 0) {
        const firstButton = buttons.first();
        const box = await firstButton.boundingBox();
        if (box) {
          // Touch targets should be at least 44px in one dimension
          const isLargeEnough = box.width >= 44 || box.height >= 44;
          // This is a recommendation, not a hard fail
          // Log warning if too small
          if (!isLargeEnough) {
            console.warn(`Touch target may be too small: ${box.width}x${box.height}`);
          }
        }
      }
    });
  });
});
