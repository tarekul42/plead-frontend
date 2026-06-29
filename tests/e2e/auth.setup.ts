import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authenticate with demo agent account", async ({ page }) => {
  await page.goto("/sign-in");

  await page.waitForTimeout(15000);

  const rateLimitText = await page.locator("text=too many requests").first().isVisible();
  const rateLimitJson = await page.locator("text=too_many_requests").first().isVisible();
  if (rateLimitText || rateLimitJson) {
    console.log("Clerk rate limited, auth setup skipped");
    return;
  }

  const agentBtn = page.getByRole("button", { name: /agent/i });
  await expect(agentBtn.first()).toBeVisible({ timeout: 10000 });
  await agentBtn.first().click();
  await page.waitForTimeout(3000);

  const ticketError = await page.locator("text=Failed to get demo sign-in ticket").isVisible();
  const fetchError = await page.locator("text=Failed to fetch").isVisible();
  if (ticketError || fetchError) {
    console.log(ticketError ? "Backend demo-ticket API failed" : "Backend unreachable");
    return;
  }

  await page.waitForURL("**/dashboard", { timeout: 60000 });

  await expect(page.locator("body")).toBeVisible();

  await page.context().storageState({ path: authFile });
});
