import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import type { DataState } from "../../app/app-state";
import { RiskDashboard } from "./RiskDashboard";
import { defaultRiskFilters, type RiskFilters } from "./filters";

function DashboardHarness({
  dataState = "live",
  initialFilters = defaultRiskFilters
}: {
  dataState?: DataState;
  initialFilters?: RiskFilters;
}) {
  const [filters, setFilters] = useState<RiskFilters>(initialFilters);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <RiskDashboard
      dataState={dataState}
      expandedId={expandedId}
      filters={filters}
      onClearFilters={() => setFilters(defaultRiskFilters)}
      onExpandedChange={setExpandedId}
      onFiltersChange={setFilters}
      reduceMotion
    />
  );
}

describe("RiskDashboard", () => {
  it("narrows the risk table with search filters and can clear them", async () => {
    const user = userEvent.setup();
    render(<DashboardHarness />);

    await user.type(screen.getByLabelText(/search risks/i), "payments");

    expect(screen.getByText("Payments Gateway")).toBeInTheDocument();
    expect(screen.queryByText("Identity Provisioning")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(screen.getByText("Identity Provisioning")).toBeInTheDocument();
  });

  it("applies region, status, and severity controls", async () => {
    const user = userEvent.setup();
    render(<DashboardHarness />);

    expect(screen.getByRole("group", { name: /filter by severity/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter by region/i), "AP-South");
    expect(screen.getByText("Customer Data Lake")).toBeInTheDocument();
    expect(screen.queryByText("Payments Gateway")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter by status/i), "investigating");
    expect(screen.getByText("Customer Data Lake")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "critical" }));
    expect(screen.getByRole("button", { name: "critical" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Customer Data Lake")).toBeInTheDocument();
  });

  it("expands and collapses risk detail panels", async () => {
    const user = userEvent.setup();
    render(<DashboardHarness />);
    const firstRow = screen.getByText("Payments Gateway").closest("tr");

    expect(firstRow).not.toBeNull();

    await user.click(within(firstRow!).getByRole("button", { name: /view/i }));

    expect(screen.getByText(/shift 18% of traffic/i)).toBeInTheDocument();

    await user.click(within(firstRow!).getByRole("button", { name: /hide/i }));

    await waitFor(() => expect(screen.queryByText(/shift 18% of traffic/i)).not.toBeInTheDocument());
  });

  it("shows the loading skeleton when data is refreshing", () => {
    render(<DashboardHarness dataState="loading" />);

    expect(screen.getByRole("status", { name: /loading operational risk data/i })).toBeInTheDocument();
  });

  it("shows a recoverable empty state when filters remove every row", async () => {
    const user = userEvent.setup();
    render(<DashboardHarness initialFilters={{ ...defaultRiskFilters, query: "not-a-real-service" }} />);

    expect(screen.getByText("No risk signals match filters")).toBeInTheDocument();

    const emptyState = screen.getByText("No risk signals match filters").closest("section");

    expect(emptyState).not.toBeNull();

    await user.click(within(emptyState!).getByRole("button", { name: "Clear filters" }));

    expect(screen.getByText("Payments Gateway")).toBeInTheDocument();
  });

  it("shows an empty state with no fake table rows", () => {
    render(<DashboardHarness dataState="empty" />);

    expect(screen.getByText("No verified risk signals")).toBeInTheDocument();
    expect(screen.queryByText("Payments Gateway")).not.toBeInTheDocument();
  });

  it("shows degraded telemetry disclosure while preserving the queue", () => {
    render(<DashboardHarness dataState="degraded" />);

    expect(screen.getByText("Telemetry delay detected")).toBeInTheDocument();
    expect(screen.getByText("Payments Gateway")).toBeInTheDocument();
  });

  it("exposes confidence as a semantic meter", () => {
    render(<DashboardHarness />);

    expect(screen.getByRole("meter", { name: "94% confidence" })).toHaveAttribute("aria-valuenow", "94");
  });
});
