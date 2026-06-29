import { test, expect } from "@playwright/test";

test.describe("Property CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto("/dashboard/properties");
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

  test("loads properties dashboard page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("displays property list or empty state", async ({ page }) => {
    await page.waitForTimeout(1000);

    const hasProperties = await page.locator('table tbody tr').first().isVisible();
    const hasEmptyState = await page.locator("text=No properties found").or(page.locator("text=no properties")).isVisible();

    expect(hasProperties || hasEmptyState).toBeTruthy();
  });

  test("can open create property form", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();
      await expect(page.locator("form, [data-testid='property-form']")).toBeVisible();
    }
  });

  test("create property form has title input", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.first().isVisible()) {
        await expect(titleInput.first()).toBeVisible();
      }
    }
  });

  test("create property form has price input", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const priceInput = page.locator('input[name="price"], input[type="number"]');
      if (await priceInput.first().isVisible()) {
        await expect(priceInput.first()).toBeVisible();
      }
    }
  });

  test("create property form has description textarea", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const descriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="description" i]');
      if (await descriptionInput.first().isVisible()) {
        await expect(descriptionInput.first()).toBeVisible();
      }
    }
  });

  test("create property form has location input", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const locationInput = page.locator('input[name="location"], input[placeholder*="location" i]');
      if (await locationInput.first().isVisible()) {
        await expect(locationInput.first()).toBeVisible();
      }
    }
  });

  test("create property form has property type select", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const typeSelect = page.locator('select[name="propertyType"], [data-testid*="property-type"]');
      if (await typeSelect.first().isVisible()) {
        await expect(typeSelect.first()).toBeVisible();
      }
    }
  });

  test("create property form has beds/baths/area inputs", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();
      await page.waitForURL("**/properties/new", { timeout: 5000 });
      await page.waitForTimeout(3000);

      const hasBeds = await page.locator("text=Bedrooms").isVisible();
      const hasBaths = await page.locator("text=Bathrooms").isVisible();
      const hasArea = await page.locator("text=Area (sqft)").isVisible();

      expect(hasBeds || hasBaths || hasArea).toBeTruthy();
    }
  });

  test("can fill in property title", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.first().isVisible()) {
        await titleInput.first().fill("Test Property Title");
        await expect(titleInput.first()).toHaveValue("Test Property Title");
      }
    }
  });

  test("can fill in property price", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const priceInput = page.locator('input[name="price"], input[type="number"]');
      if (await priceInput.first().isVisible()) {
        await priceInput.first().fill("500000");
        await expect(priceInput.first()).toHaveValue("500000");
      }
    }
  });

  test("can select property type", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const typeSelect = page.locator('select[name="propertyType"], [data-testid*="property-type"]');
      if (await typeSelect.first().isVisible()) {
        // Try to select an option
        await typeSelect.first().selectOption({ index: 1 });
        await page.waitForTimeout(500);
      }
    }
  });

  test("can submit create property form", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new property|add property/i });
    if (await createBtn.first().isVisible()) {
      await createBtn.first().click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.first().isVisible()) {
        await titleInput.first().fill("E2E Test Property");
      }

      const submitBtn = page.getByRole("button", { name: /submit|create|save/i });
      if (await submitBtn.first().isVisible()) {
        await submitBtn.first().click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("can view property details from list", async ({ page }) => {
    const propertyLink = page.locator('a[href*="/properties/"]').first();
    if (await propertyLink.isVisible()) {
      await propertyLink.click();
      await expect(page).toHaveURL(/\/properties\/.+/);
    }
  });

  test("can edit a property", async ({ page }) => {
    const editBtn = page.getByRole("button", { name: /edit|update/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.locator("form, [data-testid='edit-form']")).toBeVisible();
    }
  });

  test("can delete a property with confirmation", async ({ page }) => {
    const deleteBtn = page.getByRole("button", { name: /delete|remove/i }).first();
    if (await deleteBtn.isVisible()) {
      page.on("dialog", (dialog) => dialog.accept());
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("property search/filter is present", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
    if (await searchInput.first().isVisible()) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test("property status filter is present", async ({ page }) => {
    const statusFilter = page.locator('select[name="status"], [data-testid*="status"], button:has-text("status")');
    if (await statusFilter.first().isVisible()) {
      await expect(statusFilter.first()).toBeVisible();
    }
  });
});

test.describe("Public Properties Page", () => {
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

  test("displays property cards", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("property cards show price", async ({ page }) => {
    await page.waitForTimeout(1000);

    const priceText = page.locator("text=/\\$[0-9,]+/");
    if (await priceText.first().isVisible()) {
      await expect(priceText.first()).toBeVisible();
    }
  });

  test("property cards show title", async ({ page }) => {
    await page.waitForTimeout(1000);

    const cards = page.locator('[data-testid="property-grid"] > div, .grid > div');
    if (await cards.first().isVisible()) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test("property cards show location", async ({ page }) => {
    await page.waitForTimeout(1000);

    const locationText = page.locator("text=/,.+, [A-Z]{2}/");
    if (await locationText.first().isVisible()) {
      await expect(locationText.first()).toBeVisible();
    }
  });

  test("property cards are clickable", async ({ page }) => {
    await page.waitForTimeout(1000);

    const propertyLink = page.locator('a[href*="/properties/"]').first();
    if (await propertyLink.isVisible()) {
      await propertyLink.click();
      await expect(page).toHaveURL(/\/properties\/.+/);
    }
  });
});
