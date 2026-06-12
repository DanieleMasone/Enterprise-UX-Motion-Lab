import { describe, expect, it, vi } from "vitest";
import { filterCommandActions, type CommandAction } from "./command-palette";

const actions: CommandAction[] = [
  {
    id: "theme",
    label: "Switch to dark mode",
    description: "Change dashboard contrast.",
    keywords: ["theme", "dark"],
    perform: vi.fn()
  },
  {
    id: "filters",
    label: "Clear filters",
    description: "Restore the full queue.",
    keywords: ["filter", "reset"],
    perform: vi.fn()
  }
];

describe("command palette helpers", () => {
  it("returns all commands for an empty query", () => {
    expect(filterCommandActions(actions, "   ")).toEqual(actions);
  });

  it("matches commands by label, description, and keywords", () => {
    expect(filterCommandActions(actions, "DARK").map((action) => action.id)).toEqual(["theme"]);
    expect(filterCommandActions(actions, "queue").map((action) => action.id)).toEqual(["filters"]);
    expect(filterCommandActions(actions, "reset").map((action) => action.id)).toEqual(["filters"]);
  });
});
