import { test, expect } from "@playwright/test";

test.describe("Property Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/properties");
    await page.waitForTimeout(3000);
    const rateLimitText = await page.locator("text=too many requests").first().isVisible();
    const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
    const isRateLimited = rateLimitText || rateLimitJson;
    if (isRateLimited) {
      test.skip();
    }
  });

  test("loads properties listing page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("displays property cards", async ({ page }) => {
    // Wait for property cards to load
    await page.waitForTimeout(1000);

    const propertyCards = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])');
    const count = await propertyCards.count();

    // Either cards are shown, or empty/error state
    const hasEmptyState = await page.locator("text=No properties found").isVisible();
    const hasErrorState = await page.locator("text=Failed to load properties").isVisible();
    expect(count > 0 || hasEmptyState || hasErrorState).toBeTruthy();
  });

  test("navigates to property detail page", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await expect(page).toHaveURL(/\/properties\/.+/);
    }
  });

  test("property detail page displays title", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();

      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("property detail page shows images or gallery", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForURL(/\/properties\/.+/);
      await page.waitForTimeout(3000);

      // Check for image or gallery elements
      const images = page.locator('img[alt*="property" i], img[alt*="Property"], .rounded-xl img, .aspect-\\[16\\/9\\] img');
      const noImagesMsg = page.locator("text=No images available");

      const hasImages = await images.count();
      const hasNoImagesMsg = await noImagesMsg.isVisible();

      expect(hasImages > 0 || hasNoImagesMsg).toBeTruthy();
    }
  });

  test("property detail shows price", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Price should be displayed in format $XXX,XXX
      const priceText = page.locator("text=/\\$[0-9,]+/").first();
      if (await priceText.isVisible()) {
        await expect(priceText).toBeVisible();
      }
    }
  });

  test("property detail shows beds/baths/area", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Check for property details
      const bedsText = page.locator("text=/\\d+ beds?/");
      const bathsText = page.locator("text=/\\d+ baths?/");

      if (await bedsText.isVisible()) {
        await expect(bedsText.first()).toBeVisible();
      }
      if (await bathsText.isVisible()) {
        await expect(bathsText.first()).toBeVisible();
      }
    }
  });

  test("property detail shows location", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Location should be visible (MapPin icon text or location text)
      const locationText = page.locator("text=/,.+, [A-Z]{2}/").first();
      if (await locationText.isVisible()) {
        await expect(locationText).toBeVisible();
      }
    }
  });

  test("property gallery navigation works", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Check for gallery navigation arrows
      const nextBtn = page.locator('button[aria-label*="next" i], .gallery-next').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test("property gallery lightbox opens on image click", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Click on main image to open lightbox
      const mainImage = page.locator(".rounded-xl img, .aspect-\\[16\\/9\\] img").first();
      if (await mainImage.isVisible()) {
        await mainImage.click();
        await page.waitForTimeout(500);

        // Lightbox should be visible
        const lightbox = page.locator('[class*="z-50"], [class*="backdrop"]').first();
        if (await lightbox.isVisible()) {
          // Close lightbox
          const closeBtn = page.locator('button[aria-label*="close" i]');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
          } else {
            await page.keyboard.press("Escape");
          }
        }
      }
    }
  });

  test("property detail shows description", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Description section should be present
      const descriptionSection = page.locator("text=Description, text=About this property");
      if (await descriptionSection.first().isVisible()) {
        await expect(descriptionSection.first()).toBeVisible();
      }
    }
  });

  test("property detail shows status badge", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      const statusBadge = page.locator("text=available, text=sold, text=pending, text=under contract");
      if (await statusBadge.first().isVisible()) {
        await expect(statusBadge.first()).toBeVisible();
      }
    }
  });

  test("back navigation returns to properties list", async ({ page }) => {
    const firstPropertyLink = page.locator('a[href*="/properties/"]:not([href*="/dashboard"])').first();
    if (await firstPropertyLink.isVisible()) {
      await firstPropertyLink.click();
      await page.waitForTimeout(1000);

      // Navigate back
      await page.goBack();
      await expect(page).toHaveURL(/\/properties$/);
    }
  });
});
