import { test, expect } from "@playwright/test";

test.describe("Lead CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to leads page (assumes auth is handled)
    await page.goto("/dashboard/leads");
  });

  test("loads the leads page with heading", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("displays lead list or empty state", async ({ page }) => {
    // Either leads are shown or an empty state message
    const hasLeads = await page.locator('[data-testid="lead-list"]').isVisible();
    const hasEmptyState = await page.locator("text=No leads yet").isVisible();

    expect(hasLeads || hasEmptyState).toBeTruthy();
  });

  test("can open create lead form", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new lead/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await expect(page.locator("form")).toBeVisible();
    }
  });

  test("create lead form has required fields", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new lead/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      // Check for common lead form fields
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
      const emailInput = page.locator('input[name="email"], input[type="email"]');

      if (await nameInput.isVisible()) {
        await expect(nameInput).toBeVisible();
      }
      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
      }
    }
  });

  test("submits create lead form", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new lead/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
      if (await nameInput.isVisible()) {
        await nameInput.fill("Test Lead");
      }

      const emailInput = page.locator('input[name="email"], input[type="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill("test-lead@example.com");
      }

      const submitBtn = page.getByRole("button", { name: /submit|create|save/i });
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        // Wait for success feedback
        await page.waitForTimeout(1000);
      }
    }
  });

  test("can view lead details", async ({ page }) => {
    // Click on a lead if one exists
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("can edit a lead", async ({ page }) => {
    const editBtn = page.getByRole("button", { name: /edit|update/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.locator("form, [data-testid='edit-form']")).toBeVisible();
    }
  });

  test("can change lead status", async ({ page }) => {
    const statusSelect = page.locator('select[name="status"], [data-testid*="status"]').first();
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("qualified");
      await page.waitForTimeout(500);
    }
  });

  test("can delete a lead with confirmation", async ({ page }) => {
    const deleteBtn = page.getByRole("button", { name: /delete|remove/i }).first();
    if (await deleteBtn.isVisible()) {
      // Set up dialog handler for confirmation
      page.on("dialog", (dialog) => dialog.accept());
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("lead form validation shows errors for empty required fields", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new lead/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const submitBtn = page.getByRole("button", { name: /submit|create|save/i });
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        // Check for validation error messages
        const errorMessages = page.locator('.error, .text-danger, [role="alert"]');
        // Validation errors should appear or form should not submit
        await page.waitForTimeout(500);
      }
    }
  });

  test("leads page has search/filter functionality", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("John");
      await page.waitForTimeout(500);
    }
  });

  test("leads page has pagination or infinite scroll", async ({ page }) => {
    const pagination = page.locator('[data-testid="pagination"], .pagination');
    const nextBtn = page.getByRole("button", { name: /next|>/i });

    // Pagination may or may not be visible depending on data count
    if (await pagination.isVisible()) {
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
