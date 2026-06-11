import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import type { DataState } from "../../app/app-state";
import { RiskDashboard } from "./RiskDashboard";
import { defaultRiskFilters, type RiskFilters } from "./filters";

function DashboardHarness({ dataState = "live" }: { dataState?: DataState }) {
  const [filters, setFilters] = useState<RiskFilters>(defaultRiskFilters);
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
});
