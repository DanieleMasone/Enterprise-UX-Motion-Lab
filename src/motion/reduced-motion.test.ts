import { describe, expect, it } from "vitest";
import { resolveReducedMotion } from "./reduced-motion";
import { getTransition } from "./transitions";

describe("reduced motion policy", () => {
  it("honors explicit overrides before system preference", () => {
    expect(resolveReducedMotion(false, "reduce")).toBe(true);
    expect(resolveReducedMotion(true, "no-preference")).toBe(false);
    expect(resolveReducedMotion(true, "system")).toBe(true);
  });

  it("collapses transition duration when reduced motion is active", () => {
    expect(getTransition("panel", true)).toEqual({ duration: 0.01 });
    expect(getTransition("panel", false).duration).toBeGreaterThan(0.01);
  });
});
