import type { DataState } from "../../app/app-state";

export interface DataStateCopy {
  label: string;
  description: string;
}

/**
 * User-facing copy for the dashboard's simulated data resilience states.
 */
export function getDataStateCopy(state: DataState): DataStateCopy {
  switch (state) {
    case "live":
      return {
        label: "Live telemetry",
        description: "Verified signals are available for triage."
      };
    case "loading":
      return {
        label: "Refreshing",
        description: "Skeleton rows preserve layout while new signals are verified."
      };
    case "empty":
      return {
        label: "No active signals",
        description: "The empty state keeps recovery action clear without hiding controls."
      };
    case "degraded":
      return {
        label: "Degraded telemetry",
        description: "The queue remains usable while ingestion freshness is disclosed."
      };
  }
}
