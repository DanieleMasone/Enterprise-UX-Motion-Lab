import { expect, test, type Page } from "@playwright/test";

async function openCommandPaletteWithShortcut(page: Page) {
  await expect(page.getByRole("button", { name: /commands/i })).toBeVisible();
  await page.locator(".app-shell").click({ position: { x: 8, y: 8 } });
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyK");
  await page.keyboard.up("Control");

  const dialog = page.getByRole("dialog", { name: /command palette/i });
  await expect(dialog).toBeVisible();

  return dialog;
}

const auditedViewports = [1920, 1440, 1280, 1024, 768, 430, 390, 375, 360];

test.describe("risk operations dashboard", () => {
  test("loads the operational surface", async ({ page }) => {
    await page.goto("./");

    await expect(page.getByRole("heading", { name: "Operational risk queue" })).toBeVisible();
    await expect(page.locator(".kpi-card")).toHaveCount(4);
    await expect(page.getByRole("table", { name: /dense anomaly and risk signal table/i })).toBeVisible();
    await expect(page.getByText("Payments Gateway")).toBeVisible();
  });

  test("opens, searches, executes, and closes the command palette from the keyboard", async ({ page }) => {
    await page.goto("./");

    const dialog = await openCommandPaletteWithShortcut(page);

    const search = page.getByLabel("Command search");
    await expect(search).toBeFocused();
    await search.fill("critical");
    await expect(page.getByRole("button", { name: /show critical risks/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await openCommandPaletteWithShortcut(page);
    await page.getByLabel("Command search").fill("density");
    await page.keyboard.press("Enter");

    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Comfortable" })).toHaveAttribute("aria-pressed", "true");
  });

  test("persists theme and density state", async ({ page }) => {
    await page.goto("./");

    await page.getByRole("button", { name: "Dark" }).click();
    await page.getByRole("button", { name: "Comfortable" }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-density", "comfortable");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-density", "comfortable");
    await expect(page.getByRole("heading", { name: "Operational risk queue" })).toBeVisible();
  });

  test("filters records and discloses detail context", async ({ page }) => {
    await page.goto("./");

    await page.getByLabel("Search risks").fill("identity");
    await expect(page.getByText("Identity Provisioning")).toBeVisible();
    await expect(page.getByText("Payments Gateway")).toBeHidden();

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByText("Payments Gateway")).toBeVisible();

    const identityRow = page.getByRole("row", { name: /RISK-1038 Identity Provisioning/i });
    await identityRow.getByRole("button", { name: "View" }).click();

    const identityDetail = page.locator("#RISK-1038-detail");
    await expect(identityDetail.getByText("Root cause")).toBeVisible();
    await expect(identityDetail.getByText(/partner import job is retrying stale entitlement bundles/i)).toBeVisible();
    await expect(identityDetail.getByText("Recommended action")).toBeVisible();
    await expect(identityDetail.getByText("Audit context")).toBeVisible();
  });

  test("keeps loading, empty, and degraded states usable", async ({ page }) => {
    await page.goto("./");

    await page.getByRole("button", { name: "Loading" }).click();
    await expect(page.getByRole("status", { name: /loading operational risk data/i })).toBeVisible();

    await page.getByRole("button", { name: "Empty" }).click();
    await expect(page.getByText("No verified risk signals")).toBeVisible();
    await expect(page.getByLabel("Search risks")).toBeVisible();

    await page.getByRole("button", { name: "Degraded" }).click();
    await expect(page.getByText("Telemetry delay detected")).toBeVisible();
    await expect(page.getByText("Payments Gateway")).toBeVisible();
  });

  test("keeps responsive layouts readable without page-level horizontal overflow", async ({ page }) => {
    for (const width of auditedViewports) {
      await page.setViewportSize({ width, height: width >= 768 ? 900 : 780 });
      await page.goto("./");

      await expect(page.getByRole("heading", { name: "Operational risk queue" })).toBeVisible();

      const layout = await page.evaluate(() => {
        const tableShell = document.querySelector<HTMLElement>(".risk-table-shell");
        const filters = document.querySelector<HTMLElement>(".filters");
        const summary = document.querySelector<HTMLElement>(".dashboard__summary");
        const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

        return {
          documentOverflowX: documentWidth - window.innerWidth,
          filterRight: filters?.getBoundingClientRect().right ?? 0,
          summaryRight: summary?.getBoundingClientRect().right ?? 0,
          tableShellScrolls: tableShell ? tableShell.scrollWidth > tableShell.clientWidth : false
        };
      });

      expect(layout.documentOverflowX, `${width}px viewport should not overflow the page`).toBeLessThanOrEqual(1);
      expect(layout.filterRight, `${width}px filters should fit viewport`).toBeLessThanOrEqual(width + 1);
      expect(layout.summaryRight, `${width}px KPI summary should fit viewport`).toBeLessThanOrEqual(width + 1);

      if (width <= 1024) {
        expect(layout.tableShellScrolls, `${width}px table should scroll inside its shell`).toBe(true);
      }

      if (width === 1440 || width === 390) {
        const dialog = await openCommandPaletteWithShortcut(page);
        const dialogBox = await page.locator(".command-palette__dialog").boundingBox();

        expect(dialogBox?.x ?? -1, `${width}px dialog should start inside viewport`).toBeGreaterThanOrEqual(0);
        expect((dialogBox?.x ?? 0) + (dialogBox?.width ?? 0), `${width}px dialog should end inside viewport`).toBeLessThanOrEqual(
          width
        );

        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
      }
    }
  });
});
