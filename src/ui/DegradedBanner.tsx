import { StatusBadge } from "./StatusBadge";

export interface DegradedBannerProps {
  visible: boolean;
}

/**
 * Degraded state disclosure that preserves workflow access while surfacing risk.
 */
export function DegradedBanner({ visible }: DegradedBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="degraded-banner" role="status" aria-live="polite">
      <StatusBadge label="degraded" />
      <div>
        <strong>Telemetry delay detected</strong>
        <p>Signals are current through the last verified ingestion window. Owner actions remain available.</p>
      </div>
    </section>
  );
}
