import { describe, expect, it, vi } from "vitest";
import {
  appStorageKeys,
  getNextDataState,
  getNextDensity,
  getNextTheme,
  getStoredDensity,
  getStoredTheme,
  parseDensityMode,
  parseThemeMode,
  persistDensity,
  persistTheme
} from "./app-state";

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

  it("parses persisted theme and density modes conservatively", () => {
    expect(parseThemeMode("dark")).toBe("dark");
    expect(parseThemeMode("sepia")).toBeNull();
    expect(parseDensityMode("comfortable")).toBe("comfortable");
    expect(parseDensityMode("wide")).toBeNull();
  });

  it("reads stored preferences and falls back when values are invalid", () => {
    const storage = new Map<string, string>();
    const adapter = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value)
    };

    adapter.setItem(appStorageKeys.theme, "dark");
    adapter.setItem(appStorageKeys.density, "comfortable");

    expect(getStoredTheme(adapter)).toBe("dark");
    expect(getStoredDensity(adapter)).toBe("comfortable");

    adapter.setItem(appStorageKeys.theme, "blue");
    adapter.setItem(appStorageKeys.density, "spacious");

    expect(getStoredTheme(adapter)).toBe("light");
    expect(getStoredDensity(adapter)).toBe("compact");
  });

  it("persists preferences without throwing when storage is unavailable", () => {
    const setItem = vi.fn();

    persistTheme("dark", { getItem: vi.fn(), setItem });
    persistDensity("comfortable", { getItem: vi.fn(), setItem });

    expect(setItem).toHaveBeenCalledWith(appStorageKeys.theme, "dark");
    expect(setItem).toHaveBeenCalledWith(appStorageKeys.density, "comfortable");

    const throwingStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error("blocked");
      })
    };

    expect(() => persistTheme("light", throwingStorage)).not.toThrow();
    expect(() => persistDensity("compact", throwingStorage)).not.toThrow();
    expect(getStoredTheme({ getItem: () => { throw new Error("blocked"); } })).toBe("light");
    expect(getStoredDensity({ getItem: () => { throw new Error("blocked"); } })).toBe("compact");
  });
});
