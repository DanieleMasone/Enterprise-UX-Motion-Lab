import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
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

  it("runs the first filtered command with Enter", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onTheme = vi.fn();

    render(<CommandPalette actions={getActions(onTheme)} onClose={onClose} open reduceMotion />);

    await user.type(screen.getByLabelText(/command search/i), "dark");
    await user.keyboard("{Enter}");

    expect(onTheme).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows a useful empty state when no command matches", async () => {
    const user = userEvent.setup();

    render(<CommandPalette actions={getActions()} onClose={vi.fn()} open reduceMotion />);

    await user.type(screen.getByLabelText(/command search/i), "archive");

    expect(screen.getByText("No matching commands")).toBeInTheDocument();
  });

  it("keeps keyboard focus inside the dialog and restores focus after close", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open commands
          </button>
          <CommandPalette actions={getActions()} onClose={() => setOpen(false)} open={open} reduceMotion />
        </>
      );
    }

    render(<Harness />);

    const launcher = screen.getByRole("button", { name: "Open commands" });
    await user.click(launcher);

    const search = screen.getByLabelText(/command search/i);
    await waitFor(() => expect(search).toHaveFocus());

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(screen.getByRole("button", { name: /clear filters/i })).toHaveFocus();

    await user.keyboard("{Tab}");
    expect(search).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(launcher).toHaveFocus());
  });

  it("prevents tab escape when no focusable dialog control is available", () => {
    render(<CommandPalette actions={[]} onClose={vi.fn()} open reduceMotion />);

    const dialog = screen.getByRole("dialog", { name: /command palette/i });
    vi.spyOn(dialog, "querySelectorAll").mockReturnValue([] as unknown as NodeListOf<HTMLElement>);

    expect(fireEvent.keyDown(dialog, { key: "Tab" })).toBe(false);
  });
});
