import { expect, test } from "@playwright/test";

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

    await page.keyboard.press("Control+K");
    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toBeVisible();

    const search = page.getByLabel("Command search");
    await expect(search).toBeFocused();
    await search.fill("critical");
    await expect(page.getByRole("button", { name: /show critical risks/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.keyboard.press("Control+K");
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
});
