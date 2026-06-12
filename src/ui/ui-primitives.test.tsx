import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DegradedBanner, EmptyState, SegmentedControl, SkeletonBlock, StatusBadge } from ".";

describe("UI primitives", () => {
  it("runs the empty-state action when one is provided", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(<EmptyState title="No records" message="Clear filters to recover." actionLabel="Clear filters" onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("omits optional empty-state and degraded controls when they are not needed", () => {
    render(
      <>
        <EmptyState title="No records" message="Nothing needs action." actionLabel="Clear filters" />
        <DegradedBanner visible={false} />
      </>
    );

    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    expect(screen.queryByText("Telemetry delay detected")).not.toBeInTheDocument();
  });

  it("renders resilient status and skeleton affordances", () => {
    render(
      <>
        <StatusBadge label="critical" />
        <DegradedBanner visible />
        <SkeletonBlock rows={3} />
      </>
    );

    expect(screen.getByText("critical")).toHaveClass("status-badge--critical");
    expect(screen.getByText("Telemetry delay detected")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: /loading operational risk data/i }).querySelectorAll(".skeleton__row")).toHaveLength(3);
  });

  it("emits selected values from segmented controls", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SegmentedControl
        ariaLabel="Density"
        onChange={onChange}
        options={[
          { label: "Compact", value: "compact" },
          { label: "Comfortable", value: "comfortable" }
        ]}
        value="compact"
      />
    );

    expect(screen.getByRole("button", { name: "Compact" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Comfortable" }));

    expect(onChange).toHaveBeenCalledWith("comfortable");
  });
});
