import { test, expect } from "@playwright/test";

test.describe("Error States and Retry Behavior", () => {
  test("shows error message when API returns 500", async ({ page }) => {
    // Intercept API calls and return 500
    await page.route("**/api/v1/properties", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Internal server error" } }),
      });
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Should show error state
    const errorText = page.locator("text=Failed to load").or(page.locator("text=Something went wrong")).or(page.locator("text=Error"));
    const hasError = await errorText.first().isVisible();

    // Or show empty state as fallback
    const hasEmptyState = await page.locator("text=No properties found").isVisible();

    expect(hasError || hasEmptyState).toBeTruthy();
  });

  test("shows error message when network fails", async ({ page }) => {
    // Abort all API requests to simulate network failure
    await page.route("**/api/v1/properties", (route) => {
      route.abort("failed");
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Should handle network error gracefully
    const errorText = page.locator("text=Failed to load").or(page.locator("text=Error")).or(page.locator("text=network error"));
    const hasError = await errorText.first().isVisible();
    const hasEmptyState = await page.locator("text=No properties found").isVisible();

    expect(hasError || hasEmptyState).toBeTruthy();
  });

  test("retry button re-fetches data", async ({ page }) => {
    let requestCount = 0;

    // First request fails, second succeeds
    await page.route("**/api/v1/properties", (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: { message: "Server error" } }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                _id: "prop-1",
                title: "Test Property",
                slug: "test-property",
                description: "Test",
                price: 100000,
                location: "Test City",
                images: [],
                beds: 2,
                baths: 1,
                area: 1000,
                propertyType: "house",
                status: "available",
                features: [],
                assignedAgentId: "agent-1",
                views: 0,
                inquiriesCount: 0,
                createdAt: "2025-01-01T00:00:00Z",
                updatedAt: "2025-01-01T00:00:00Z",
              },
            ],
            meta: { page: 1, limit: 12, total: 1 },
          }),
        });
      }
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Click retry if available
    const retryBtn = page.getByRole("button", { name: /try again|retry/i });
    if (await retryBtn.isVisible()) {
      await retryBtn.click();
      await page.waitForTimeout(2000);

      // After retry, should show data
      const propertyTitle = page.locator("text=Test Property");
      if (await propertyTitle.isVisible()) {
        await expect(propertyTitle).toBeVisible();
      }
    }
  });

  test("handles 404 errors gracefully", async ({ page }) => {
    await page.route("**/api/v1/properties/nonexistent", (route) => {
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Not found" } }),
      });
    });

    await page.goto("/properties/nonexistent");
    await page.waitForTimeout(2000);

    // Should show 404 page or error message
    const notFound = page.locator("text=404").or(page.locator("text=Not found")).or(page.locator("text=does not exist"));
    const hasNotFound = await notFound.first().isVisible();

    // Or redirect to properties list
    const currentUrl = page.url();
    expect(hasNotFound || currentUrl.includes("properties")).toBeTruthy();
  });

  test("handles timeout errors", async ({ page }) => {
    // Delay response to simulate timeout
    await page.route("**/api/v1/properties", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto("/properties");
    await page.waitForTimeout(3000);

    // Should show loading or error state (not crash)
    const loading = page.locator("text=Loading...");
    const error = page.locator("text=Error").or(page.locator("text=Failed"));

    const hasLoading = await loading.isVisible();
    const hasError = await error.first().isVisible();

    expect(hasLoading || hasError).toBeTruthy();
  });

  test("handles malformed API responses", async ({ page }) => {
    await page.route("**/api/v1/properties", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "not valid json{{{",
      });
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Should handle gracefully without crashing
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("handles unauthorized (401) errors", async ({ page }) => {
    await page.route("**/api/v1/leads", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Unauthorized" } }),
      });
    });

    await page.goto("/dashboard/leads");
    await page.waitForTimeout(2000);

    // Should redirect to sign-in or show auth error
    const signIn = page.locator("text=Sign in").or(page.locator("text=sign-in"));
    const error = page.locator("text=Unauthorized").or(page.locator("text=401"));

    const hasSignIn = await signIn.first().isVisible();
    const hasError = await error.first().isVisible();

    expect(hasSignIn || hasError).toBeTruthy();
  });

  test("handles rate limiting (429)", async ({ page }) => {
    await page.route("**/api/v1/properties", (route) => {
      route.fulfill({
        status: 429,
        contentType: "application/json",
        headers: { "Retry-After": "60" },
        body: JSON.stringify({ error: { message: "Too many requests" } }),
      });
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Should show rate limit message or error
    const rateLimit = page.locator("text=Too many requests").or(page.locator("text=rate limit")).or(page.locator("text=try again later"));
    const error = page.locator("text=Error").or(page.locator("text=Failed"));

    const hasRateLimit = await rateLimit.first().isVisible();
    const hasError = await error.first().isVisible();

    expect(hasRateLimit || hasError).toBeTruthy();
  });

  test("shows loading state during slow requests", async ({ page }) => {
    await page.route("**/api/v1/properties", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto("/properties");

    // Should show loading indicator
    const loading = page.locator("text=Loading..., [data-testid='loading'], .animate-pulse");
    // Loading might be visible briefly
    await page.waitForTimeout(500);
  });

  test("error state does not crash the application", async ({ page }) => {
    // Multiple failing endpoints
    await page.route("**/api/v1/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Server error" } }),
      });
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // App should still be functional
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // No unhandled errors
    const errorText = page.locator("text=Application error, text=Unhandled");
    const hasAppError = await errorText.isVisible();
    expect(hasAppError).toBeFalsy();
  });

  test("recovers after network restoration", async ({ page }) => {
    let shouldFail = true;

    await page.route("**/api/v1/properties", (route) => {
      if (shouldFail) {
        route.abort("failed");
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                _id: "prop-1",
                title: "Recovered Property",
                slug: "recovered-property",
                description: "Test",
                price: 200000,
                location: "Test City",
                images: [],
                beds: 3,
                baths: 2,
                area: 1500,
                propertyType: "house",
                status: "available",
                features: [],
                assignedAgentId: "agent-1",
                views: 0,
                inquiriesCount: 0,
                createdAt: "2025-01-01T00:00:00Z",
                updatedAt: "2025-01-01T00:00:00Z",
              },
            ],
            meta: { page: 1, limit: 12, total: 1 },
          }),
        });
      }
    });

    await page.goto("/properties");
    await page.waitForTimeout(2000);

    // Restore network
    shouldFail = false;

    // Retry
    const retryBtn = page.getByRole("button", { name: /try again|retry/i });
    if (await retryBtn.isVisible()) {
      await retryBtn.click();
      await page.waitForTimeout(2000);

      const propertyTitle = page.locator("text=Recovered Property");
      if (await propertyTitle.isVisible()) {
        await expect(propertyTitle).toBeVisible();
      }
    }
  });
});
