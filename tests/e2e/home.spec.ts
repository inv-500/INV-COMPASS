import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page loads with a clear title and no accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "INV Compass" }),
  ).toBeVisible();
  // The connection check shows a result or an explanation, never a blank space.
  await expect(
    page.getByText(
      /Connected to the INV Compass database|couldn.t confirm the database connection/,
    ),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("keyboard users can skip straight to the content", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Keyboard skip link is a desktop behaviour");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});

test("an unknown page shows the plain not-found message", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(
    page.getByRole("heading", { name: "We can't show this page" }),
  ).toBeVisible();
});
