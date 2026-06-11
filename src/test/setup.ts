import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

function createMatchMedia(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: createMatchMedia(false)
  });
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: vi.fn()
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
