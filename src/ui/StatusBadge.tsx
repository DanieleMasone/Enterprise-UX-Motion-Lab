import type { RiskSeverity, RiskStatus } from "../data";

export interface StatusBadgeProps {
  label: RiskSeverity | RiskStatus | "degraded" | "live";
}

/**
 * Compact semantic badge for high-density table and panel metadata.
 */
export function StatusBadge({ label }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${label}`}>{label}</span>;
}
