export type ThemeMode = "light" | "dark";
export type DensityMode = "compact" | "comfortable";
export type DataState = "live" | "loading" | "empty" | "degraded";

export const dataStateOptions: { label: string; value: DataState }[] = [
  { label: "Live", value: "live" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Degraded", value: "degraded" }
];

/**
 * Pure theme transition helper used by controls and command actions.
 */
export function getNextTheme(theme: ThemeMode): ThemeMode {
  return theme === "dark" ? "light" : "dark";
}

/**
 * Pure density transition helper used by controls and command actions.
 */
export function getNextDensity(density: DensityMode): DensityMode {
  return density === "compact" ? "comfortable" : "compact";
}

/**
 * Advances the demo data state in a predictable sequence for keyboard commands.
 */
export function getNextDataState(state: DataState): DataState {
  const order: DataState[] = ["live", "loading", "empty", "degraded"];
  return order[(order.indexOf(state) + 1) % order.length];
}
