export type ThemeMode = "light" | "dark";
export type DensityMode = "compact" | "comfortable";
export type DataState = "live" | "loading" | "empty" | "degraded";

/**
 * Minimal storage contract used by preference persistence helpers and tests.
 */
export type AppStorage = Pick<Storage, "getItem" | "setItem">;

export const appStorageKeys = {
  theme: "enterprise-ux-motion-lab:theme",
  density: "enterprise-ux-motion-lab:density"
} as const;

export const dataStateOptions: { label: string; value: DataState }[] = [
  { label: "Live", value: "live" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Degraded", value: "degraded" }
];

function getBrowserStorage(): AppStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function parseThemeMode(value: string | null): ThemeMode | null {
  return value === "light" || value === "dark" ? value : null;
}

export function parseDensityMode(value: string | null): DensityMode | null {
  return value === "compact" || value === "comfortable" ? value : null;
}

/**
 * Resolves the stored theme while falling back safely when storage is absent.
 */
export function getStoredTheme(
  storage: Pick<Storage, "getItem"> | null = getBrowserStorage(),
  fallback: ThemeMode = "light"
): ThemeMode {
  try {
    return parseThemeMode(storage?.getItem(appStorageKeys.theme) ?? null) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Resolves the stored density while keeping compact mode as the operational default.
 */
export function getStoredDensity(
  storage: Pick<Storage, "getItem"> | null = getBrowserStorage(),
  fallback: DensityMode = "compact"
): DensityMode {
  try {
    return parseDensityMode(storage?.getItem(appStorageKeys.density) ?? null) ?? fallback;
  } catch {
    return fallback;
  }
}

export function persistTheme(theme: ThemeMode, storage: AppStorage | null = getBrowserStorage()): void {
  try {
    storage?.setItem(appStorageKeys.theme, theme);
  } catch {
    // Storage can be unavailable in constrained browser contexts.
  }
}

export function persistDensity(density: DensityMode, storage: AppStorage | null = getBrowserStorage()): void {
  try {
    storage?.setItem(appStorageKeys.density, density);
  } catch {
    // Storage can be unavailable in constrained browser contexts.
  }
}

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
