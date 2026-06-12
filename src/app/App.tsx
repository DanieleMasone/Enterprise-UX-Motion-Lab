import { MotionConfig } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CommandPalette, type CommandAction } from "../features/command-palette";
import { RiskDashboard, defaultRiskFilters, type RiskFilters } from "../features/dashboard";
import { getDataStateCopy } from "../features/loading-states";
import { useReducedMotionPreference } from "../motion/reduced-motion";
import { Button, SegmentedControl } from "../ui";
import {
  dataStateOptions,
  getNextDataState,
  getNextDensity,
  getNextTheme,
  getStoredDensity,
  getStoredTheme,
  persistDensity,
  persistTheme,
  type DataState,
  type DensityMode,
  type ThemeMode
} from "./app-state";

/**
 * Application shell that coordinates global UX state and command workflows.
 */
export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [density, setDensity] = useState<DensityMode>(() => getStoredDensity());
  const [dataState, setDataState] = useState<DataState>("live");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("RISK-1042");
  const [filters, setFilters] = useState<RiskFilters>(defaultRiskFilters);
  const filterSearchRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotionPreference();
  const dataStateCopy = getDataStateCopy(dataState);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = density;
    persistTheme(theme);
    persistDensity(density);
  }, [density, theme]);

  useEffect(() => {
    const handleCommandShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleCommandShortcut);
    return () => window.removeEventListener("keydown", handleCommandShortcut);
  }, []);

  const clearFilters = () => setFilters(defaultRiskFilters);
  const focusFilters = () => filterSearchRef.current?.focus();

  const commandActions = useMemo<CommandAction[]>(
    () => [
      {
        id: "toggle-theme",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        description: "Change dashboard contrast without leaving the workflow.",
        keywords: ["theme", "dark", "light"],
        perform: () => setTheme((current) => getNextTheme(current))
      },
      {
        id: "toggle-density",
        label: `Use ${density === "compact" ? "comfortable" : "compact"} density`,
        description: "Adjust row spacing for scanning or review.",
        keywords: ["density", "compact", "comfortable"],
        perform: () => setDensity((current) => getNextDensity(current))
      },
      {
        id: "focus-filters",
        label: "Focus risk filters",
        description: "Jump to the search field in the filter strip.",
        keywords: ["filter", "search", "risk"],
        perform: focusFilters
      },
      {
        id: "clear-filters",
        label: "Clear filters",
        description: "Restore all regions, severities, statuses, and search terms.",
        keywords: ["filter", "reset", "clear"],
        perform: clearFilters
      },
      {
        id: "critical-only",
        label: "Show critical risks",
        description: "Narrow the queue to critical signals.",
        keywords: ["critical", "severity", "risk"],
        perform: () => setFilters((current) => ({ ...current, severities: ["critical"] }))
      },
      {
        id: "toggle-data-state",
        label: "Cycle data state",
        description: "Preview live, loading, empty, and degraded states.",
        keywords: ["loading", "empty", "degraded", "state"],
        perform: () => setDataState((current) => getNextDataState(current))
      },
      {
        id: "expand-top-risk",
        label: "Expand top risk",
        description: "Open the first critical signal detail panel.",
        keywords: ["details", "panel", "expand"],
        perform: () => setExpandedId("RISK-1042")
      }
    ],
    [density, theme]
  );

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <div className="app-shell" data-motion={reduceMotion ? "reduced" : "standard"}>
        <header className="app-header">
          <div className="app-header__identity">
            <p className="app-header__eyebrow">Enterprise UX Motion Lab</p>
            <strong>Risk operations control surface</strong>
            <span>{dataStateCopy.label}: {dataStateCopy.description}</span>
          </div>
          <div className="app-header__controls" aria-label="Application controls">
            <SegmentedControl
              ariaLabel="Theme"
              onChange={setTheme}
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" }
              ]}
              value={theme}
            />
            <SegmentedControl
              ariaLabel="Density"
              onChange={setDensity}
              options={[
                { label: "Compact", value: "compact" },
                { label: "Comfortable", value: "comfortable" }
              ]}
              value={density}
            />
            <SegmentedControl
              ariaLabel="Data state"
              onChange={setDataState}
              options={dataStateOptions}
              value={dataState}
            />
            <Button onClick={() => setCommandPaletteOpen(true)} variant="primary">
              Commands <kbd>Ctrl/Cmd K</kbd>
            </Button>
          </div>
        </header>

        <RiskDashboard
          dataState={dataState}
          expandedId={expandedId}
          filterSearchRef={filterSearchRef}
          filters={filters}
          onClearFilters={clearFilters}
          onExpandedChange={setExpandedId}
          onFiltersChange={setFilters}
          reduceMotion={reduceMotion}
        />

        <CommandPalette
          actions={commandActions}
          onClose={() => setCommandPaletteOpen(false)}
          open={commandPaletteOpen}
          reduceMotion={reduceMotion}
        />
      </div>
    </MotionConfig>
  );
}
