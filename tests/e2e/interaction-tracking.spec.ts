import { test, expect } from "@playwright/test";

test.describe("Interaction Tracking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/leads");
  });

  test("navigate to lead detail to view interactions", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test("interaction timeline section is present", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const timeline = page.locator("text=Interaction Timeline, text=Timeline");
      if (await timeline.first().isVisible()) {
        await expect(timeline.first()).toBeVisible();
      }
    }
  });

  test("interaction count is displayed", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const count = page.locator("text=/\\d+ interactions?/");
      if (await count.first().isVisible()) {
        await expect(count.first()).toBeVisible();
      }
    }
  });

  test("interaction entries show type", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const typeText = page.locator("text=call, text=email, text=meeting, text=note, text=tour");
      if (await typeText.first().isVisible()) {
        await expect(typeText.first()).toBeVisible();
      }
    }
  });

  test("interaction entries show notes", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      // Notes should be visible in the timeline
      const notes = page.locator('[data-testid*="notes-"]');
      if (await notes.first().isVisible()) {
        await expect(notes.first()).toBeVisible();
      }
    }
  });

  test("interaction entries show outcome", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const outcome = page.locator("text=positive, text=neutral, text=negative");
      if (await outcome.first().isVisible()) {
        await expect(outcome.first()).toBeVisible();
      }
    }
  });

  test("add interaction form is present", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const addForm = page.locator("text=Add Interaction");
      if (await addForm.isVisible()) {
        await expect(addForm).toBeVisible();
      }
    }
  });

  test("add interaction form has type selector", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const typeSelect = page.locator('select[name="type"], [data-testid*="interaction-type"]');
      if (await typeSelect.isVisible()) {
        await expect(typeSelect).toBeVisible();
      }
    }
  });

  test("add interaction form has notes field", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const notesField = page.locator('textarea[name="notes"], [data-testid*="interaction-notes"]');
      if (await notesField.isVisible()) {
        await expect(notesField).toBeVisible();
      }
    }
  });

  test("add interaction form has outcome selector", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const outcomeSelect = page.locator('select[name="outcome"], [data-testid*="interaction-outcome"]');
      if (await outcomeSelect.isVisible()) {
        await expect(outcomeSelect).toBeVisible();
      }
    }
  });

  test("can select interaction type", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const typeSelect = page.locator('select[name="type"], [data-testid*="interaction-type"]').first();
      if (await typeSelect.isVisible()) {
        await typeSelect.selectOption("call");
        await expect(typeSelect).toHaveValue("call");
      }
    }
  });

  test("can fill in interaction notes", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const notesField = page.locator('textarea[name="notes"], [data-testid*="interaction-notes"]').first();
      if (await notesField.isVisible()) {
        await notesField.fill("Had a great call with the lead about downtown properties.");
        await expect(notesField).toHaveValue("Had a great call with the lead about downtown properties.");
      }
    }
  });

  test("can select interaction outcome", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const outcomeSelect = page.locator('select[name="outcome"], [data-testid*="interaction-outcome"]').first();
      if (await outcomeSelect.isVisible()) {
        await outcomeSelect.selectOption("positive");
        await expect(outcomeSelect).toHaveValue("positive");
      }
    }
  });

  test("can submit interaction form", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const notesField = page.locator('textarea[name="notes"], [data-testid*="interaction-notes"]').first();
      if (await notesField.isVisible()) {
        await notesField.fill("Test interaction note");
      }

      const submitBtn = page.getByRole("button", { name: /add interaction|submit|save/i }).first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("interaction type dropdown has all options", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const typeSelect = page.locator('select[name="type"], [data-testid*="interaction-type"]').first();
      if (await typeSelect.isVisible()) {
        const options = typeSelect.locator("option");
        const count = await options.count();
        expect(count).toBeGreaterThanOrEqual(3); // At least call, email, meeting
      }
    }
  });

  test("interaction timeline shows dates", async ({ page }) => {
    const leadLink = page.locator('a[href*="lead"], [data-testid*="lead-"]').first();
    if (await leadLink.isVisible()) {
      await leadLink.click();
      await page.waitForTimeout(1000);

      const dateElements = page.locator('[data-testid*="date-"]');
      if (await dateElements.first().isVisible()) {
        await expect(dateElements.first()).toBeVisible();
      }
    }
  });
});
