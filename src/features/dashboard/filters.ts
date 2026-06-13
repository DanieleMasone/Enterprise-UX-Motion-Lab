import type { RiskRecord, RiskSeverity, RiskStatus } from "../../data";

export interface RiskFilters {
  query: string;
  region: string;
  status: RiskStatus | "all";
  severities: RiskSeverity[];
}

export const severityOrder: RiskSeverity[] = ["critical", "high", "medium", "low"];

export const defaultRiskFilters: RiskFilters = {
  query: "",
  region: "all",
  status: "all",
  severities: [...severityOrder]
};

/**
 * Resolves whether filters are back at the dashboard's default state.
 */
export function areRiskFiltersDefault(filters: RiskFilters): boolean {
  return (
    filters.query === defaultRiskFilters.query &&
    filters.region === defaultRiskFilters.region &&
    filters.status === defaultRiskFilters.status &&
    filters.severities.length === defaultRiskFilters.severities.length &&
    defaultRiskFilters.severities.every((severity) => filters.severities.includes(severity))
  );
}

/**
 * Filters operational risk records using the dashboard's visible controls.
 */
export function filterRiskRecords(records: RiskRecord[], filters: RiskFilters): RiskRecord[] {
  const query = filters.query.trim().toLowerCase();

  return records.filter((record) => {
    const matchesSeverity = filters.severities.includes(record.severity);
    const matchesRegion = filters.region === "all" || record.region === filters.region;
    const matchesStatus = filters.status === "all" || record.status === filters.status;
    const searchableText = [
      record.id,
      record.service,
      record.owner,
      record.signal,
      record.impact,
      record.region
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = query.length === 0 || searchableText.includes(query);

    return matchesSeverity && matchesRegion && matchesStatus && matchesQuery;
  });
}

/**
 * Toggles a severity while preventing an accidental no-severity dead end.
 */
export function toggleSeverityFilter(filters: RiskFilters, severity: RiskSeverity): RiskFilters {
  const hasSeverity = filters.severities.includes(severity);
  const nextSeverities = hasSeverity
    ? filters.severities.filter((item) => item !== severity)
    : [...filters.severities, severity];

  return {
    ...filters,
    severities: nextSeverities.length > 0 ? nextSeverities : [severity]
  };
}

export function getRiskRegions(records: RiskRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.region))).sort();
}
