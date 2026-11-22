import { expect, test } from "@playwright/test";

test("shows only the Hello World heading", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText("Hello World");
  await expect(page.locator("body")).toHaveText("Hello World");
});
