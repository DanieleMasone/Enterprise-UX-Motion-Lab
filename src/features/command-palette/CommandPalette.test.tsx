import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "./CommandPalette";
import type { CommandAction } from "./command-palette";

function getActions(onTheme = vi.fn()): CommandAction[] {
  return [
    {
      id: "theme",
      label: "Switch to dark mode",
      description: "Change dashboard contrast.",
      keywords: ["theme", "dark"],
      perform: onTheme
    },
    {
      id: "filters",
      label: "Clear filters",
      description: "Restore the full queue.",
      keywords: ["filter", "reset"],
      perform: vi.fn()
    }
  ];
}

describe("CommandPalette", () => {
  it("filters commands and runs the selected action", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onTheme = vi.fn();

    render(<CommandPalette actions={getActions(onTheme)} onClose={onClose} open reduceMotion />);

    await user.type(screen.getByLabelText(/command search/i), "dark");

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /clear filters/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(onTheme).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<CommandPalette actions={getActions()} onClose={onClose} open reduceMotion />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
