import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROLES = [
  ["admin", "Admin"],
  ["designer", "Designer"],
  ["gfc", "GFC"],
  ["procurement", "Procurement"],
  ["vendor_team", "Vendor team"],
  ["factory", "Factory"],
  ["onsite", "On-site"],
] as const;

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
    ),
  ).toEqual([]);
}

for (const scheme of ["light", "dark"] as const) {
  test(`design page has no accessibility violations (${scheme} page theme)`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/design");
    await expect(
      page.getByRole("heading", { level: 1, name: "Design system" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });
}

test("design page switches theme", async ({ page }) => {
  await page.goto("/design");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("confirm dialog traps focus, closes with Escape and returns focus", async ({
  page,
}) => {
  await page.goto("/design");
  const trigger = page.getByRole("button", { name: "Delete drafts" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Delete 3 drafts?" });
  await expect(dialog).toBeVisible();
  await expectNoAxeViolations(page);
  await expect(
    dialog.getByRole("button", { name: "Delete 3 drafts" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("toast offers Undo", async ({ page }) => {
  await page.goto("/design");
  await page.getByRole("button", { name: "Show a toast with Undo" }).click();
  const toast = page.getByText("Snag archived");
  await expect(toast).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByText("Snag restored")).toBeVisible();
});

test("row actions menu works from the keyboard", async ({ page }) => {
  await page.goto("/design");
  const trigger = page.getByRole("button", { name: "Row actions" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Assign" })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menuitem", { name: "Assign" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("skip link works on the design page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard skip link is a desktop behaviour");
  await page.goto("/design");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});

test("buttons are 32 px with a mouse and 44 px on a phone", async ({
  page,
  isMobile,
}) => {
  await page.goto("/design");
  const box = await page
    .getByRole("button", { name: "Delete drafts" })
    .boundingBox();
  expect(box?.height).toBe(isMobile ? 44 : 32);
});

test.describe("tablet", () => {
  test.use({ viewport: { width: 820, height: 1180 }, hasTouch: true });
  test("buttons are 36 px on a tablet", async ({ page, isMobile }) => {
    test.skip(isMobile, "Tablet size is checked once");
    await page.goto("/design");
    const box = await page
      .getByRole("button", { name: "Delete drafts" })
      .boundingBox();
    expect(box?.height).toBe(36);
  });
});

for (const [slug, label] of ROLES) {
  test(`shell preview for ${label}: menu, accessibility and no finance leaks`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(`/design/shell/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations(page);

    const finance = page.getByRole("button", {
      name: /^(Payments|Cost sheets)$/,
    });
    if (isMobile) {
      await page.getByRole("button", { name: "More" }).click();
    }
    const payments = page.getByRole("button", {
      name: "Payments",
      exact: true,
    });
    const costSheets = page.getByRole("button", {
      name: "Cost sheets",
      exact: true,
    });
    if (slug === "admin") await expect(payments).toBeVisible();
    else await expect(payments).toHaveCount(0);
    if (slug === "procurement") await expect(costSheets).toBeVisible();
    else await expect(costSheets).toHaveCount(0);
    void finance;
  });
}

test("desktop shell: sidebar collapses, is remembered, and menu items show a screen purpose", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Sidebar is a desktop and tablet feature");
  await page.goto("/design/shell/procurement");
  await page.getByRole("button", { name: "BOQ to verify" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "BOQ to verify" }),
  ).toBeVisible();
  await expect(
    page.getByText("BOQs waiting on Procurement, with costing."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.locator("aside")).toHaveCSS("width", "56px");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Expand sidebar" }),
  ).toBeVisible();
  await expect(page.locator("aside")).toHaveCSS("width", "56px");
  // Labels stay available to screen readers while collapsed.
  await expect(
    page.getByRole("button", { name: "PO register" }),
  ).toBeAttached();

  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await expect(page.locator("aside")).toHaveCSS("width", "240px");
});

test("desktop shell: account menu changes the theme", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Covered on desktop");
  await page.goto("/design/shell/designer");
  await page
    .getByRole("button", { name: /Account menu for Asha Menon/ })
    .click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("phone shell: bottom bar has at most five items and More opens the full menu", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Phone only");
  await page.goto("/design/shell/onsite");
  const bar = page.getByRole("navigation", { name: "Main tabs" });
  await expect(bar).toBeVisible();
  const items = bar.locator("a, button");
  expect(await items.count()).toBeLessThanOrEqual(5);
  await expect(bar.getByText("Today")).toBeVisible();
  await expect(bar.getByText("Scan")).toBeVisible();
  await expect(page.locator("aside")).toBeHidden();

  await bar.getByRole("button", { name: "More" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("button", { name: "Daily report" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
  await menu.getByRole("button", { name: "Daily report" }).click();
  await expect(menu).toBeHidden();
  await expect(
    page.getByRole("heading", { level: 1, name: "Daily report" }),
  ).toBeVisible();
});

test("an unknown role preview shows the not-found page", async ({ page }) => {
  await page.goto("/design/shell/not-a-role");
  await expect(
    page.getByRole("heading", { name: "We can't show this page" }),
  ).toBeVisible();
});

// docs/design-system.md section 8: route JavaScript under 200 KB gzipped. We count the scripts the page's own HTML asks
// for. Next.js also downloads other pages in the background when a link is on screen (the breadcrumb links to
// /design), and that is not this page's weight. /design itself loads every component at once, is internal and
// hidden on the live site, so it has its own higher limit.
const BUDGETS_KB: [string, number][] = [
  ["/", 200],
  ["/design/shell/admin", 200],
  ["/design/shell/onsite", 200],
  ["/design", 230],
];

for (const [url, limit] of BUDGETS_KB) {
  test(`JavaScript for ${url} stays under ${limit} KB gzipped`, async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Uses the Chromium network log");
    const html = await (await context.request.get(url)).text();
    const own = new Set(
      html.match(/\/_next\/static\/chunks\/[\w-]+\.js/g) ?? [],
    );
    const client = await context.newCDPSession(page);
    await client.send("Network.enable");
    const scripts = new Map<string, string>();
    let bytes = 0;
    client.on("Network.responseReceived", (e) => {
      if (e.type === "Script")
        scripts.set(e.requestId, new URL(e.response.url).pathname);
    });
    client.on("Network.loadingFinished", (e) => {
      const path = scripts.get(e.requestId);
      if (path && own.has(path)) bytes += e.encodedDataLength;
    });
    await page.goto(url, { waitUntil: "networkidle" });
    expect(own.size, "the page names its scripts in its HTML").toBeGreaterThan(
      5,
    );
    expect(bytes / 1024, `${url} script KB`).toBeLessThan(limit);
  });
}
