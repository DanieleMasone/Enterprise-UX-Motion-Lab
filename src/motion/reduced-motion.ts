import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

/**
 * Resolves whether motion should be reduced for a caller-controlled preference.
 * The helper is pure so interaction policy can be tested without a browser.
 */
export function resolveReducedMotion(
  systemPrefersReducedMotion: boolean,
  override: "system" | "reduce" | "no-preference" = "system"
): boolean {
  if (override === "reduce") {
    return true;
  }

  if (override === "no-preference") {
    return false;
  }

  return systemPrefersReducedMotion;
}

/**
 * Tracks the operating-system reduced-motion preference for app-level policy.
 */
export function useReducedMotionPreference(): boolean {
  const getInitial = () =>
    typeof window !== "undefined" &&
    "matchMedia" in window &&
    window.matchMedia(reducedMotionQuery).matches;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitial);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return undefined;
    }

    const media = window.matchMedia(reducedMotionQuery);
    const handleChange = () => setPrefersReducedMotion(media.matches);

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
