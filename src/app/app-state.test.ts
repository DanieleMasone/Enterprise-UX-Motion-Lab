import { describe, expect, it } from "vitest";
import { getNextDataState, getNextDensity, getNextTheme } from "./app-state";

describe("app state helpers", () => {
  it("toggles theme and density deterministically", () => {
    expect(getNextTheme("light")).toBe("dark");
    expect(getNextTheme("dark")).toBe("light");
    expect(getNextDensity("compact")).toBe("comfortable");
    expect(getNextDensity("comfortable")).toBe("compact");
  });

  it("cycles data states in the same order exposed by the command palette", () => {
    expect(getNextDataState("live")).toBe("loading");
    expect(getNextDataState("loading")).toBe("empty");
    expect(getNextDataState("empty")).toBe("degraded");
    expect(getNextDataState("degraded")).toBe("live");
  });
});
