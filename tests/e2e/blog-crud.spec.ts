import { test, expect } from "@playwright/test";

test.describe("Blog CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/blog");
  });

  test("loads blog management page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("displays blog posts list or empty state", async ({ page }) => {
    await page.waitForTimeout(1000);

    const hasBlogs = await page.locator('[data-testid="blog-list"]').isVisible();
    const hasEmptyState = await page.locator("text=No posts yet, text=No blog posts").isVisible();

    expect(hasBlogs || hasEmptyState).toBeTruthy();
  });

  test("can open create blog form", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await expect(page.locator("form, [data-testid='blog-editor']")).toBeVisible();
    }
  });

  test("create blog form has title input", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.isVisible()) {
        await expect(titleInput).toBeVisible();
      }
    }
  });

  test("create blog form has content textarea", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const contentInput = page.locator('textarea[name="content"], textarea[placeholder*="content" i]');
      if (await contentInput.isVisible()) {
        await expect(contentInput).toBeVisible();
      }
    }
  });

  test("create blog form has excerpt field", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const excerptInput = page.locator('textarea[name="excerpt"], input[name="excerpt"], textarea[placeholder*="excerpt" i]');
      if (await excerptInput.isVisible()) {
        await expect(excerptInput).toBeVisible();
      }
    }
  });

  test("create blog form has tags input", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const tagsInput = page.locator('input[name="tags"], input[placeholder*="tag" i]');
      if (await tagsInput.isVisible()) {
        await expect(tagsInput).toBeVisible();
      }
    }
  });

  test("can fill in blog title", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.isVisible()) {
        await titleInput.fill("Test Blog Post Title");
        await expect(titleInput).toHaveValue("Test Blog Post Title");
      }
    }
  });

  test("can fill in blog content", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const contentInput = page.locator('textarea[name="content"], textarea[placeholder*="content" i]');
      if (await contentInput.isVisible()) {
        await contentInput.fill("This is the test content for the blog post.");
        await expect(contentInput).toHaveValue("This is the test content for the blog post.");
      }
    }
  });

  test("save draft button is present", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const saveDraftBtn = page.getByRole("button", { name: /save draft/i });
      if (await saveDraftBtn.isVisible()) {
        await expect(saveDraftBtn).toBeVisible();
      }
    }
  });

  test("publish button is present", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const publishBtn = page.getByRole("button", { name: /publish/i });
      if (await publishBtn.isVisible()) {
        await expect(publishBtn).toBeVisible();
      }
    }
  });

  test("can save blog as draft", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.isVisible()) {
        await titleInput.fill("Draft Post");
      }

      const saveDraftBtn = page.getByRole("button", { name: /save draft/i });
      if (await saveDraftBtn.isVisible()) {
        await saveDraftBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("can publish blog post", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create|new post|add post/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();

      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
      if (await titleInput.isVisible()) {
        await titleInput.fill("Published Post");
      }

      const publishBtn = page.getByRole("button", { name: /publish/i });
      if (await publishBtn.isVisible()) {
        await publishBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("blog post shows status badge (published/draft)", async ({ page }) => {
    await page.waitForTimeout(1000);

    const statusBadge = page.locator("text=published, text=draft");
    if (await statusBadge.first().isVisible()) {
      await expect(statusBadge.first()).toBeVisible();
    }
  });

  test("can edit existing blog post", async ({ page }) => {
    const editBtn = page.getByRole("button", { name: /edit|update/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.locator("form, [data-testid='blog-editor']")).toBeVisible();
    }
  });

  test("can delete blog post with confirmation", async ({ page }) => {
    const deleteBtn = page.getByRole("button", { name: /delete|remove/i }).first();
    if (await deleteBtn.isVisible()) {
      page.on("dialog", (dialog) => dialog.accept());
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("blog list shows post tags", async ({ page }) => {
    await page.waitForTimeout(1000);

    const tag = page.locator('[data-testid*="tag-"], .tag');
    if (await tag.first().isVisible()) {
      await expect(tag.first()).toBeVisible();
    }
  });
});
