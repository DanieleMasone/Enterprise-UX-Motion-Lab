export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type RiskStatus = "open" | "investigating" | "contained";
export type TrendDirection = "up" | "down" | "flat";

/**
 * Domain record used by the dashboard, filters, detail panels, and tests.
 *
 * The fields intentionally resemble a real operational risk queue rather than
 * generic placeholder table content.
 */
export interface RiskRecord {
  id: string;
  service: string;
  region: string;
  severity: RiskSeverity;
  status: RiskStatus;
  owner: string;
  signal: string;
  confidence: number;
  impact: string;
  slaHours: number;
  trend: TrendDirection;
  lastSeen: string;
  rootCause: string;
  recommendedAction: string;
  auditContext: string;
}

/**
 * KPI model for reusable summary cards.
 */
export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: TrendDirection;
  context: string;
}

export const riskRecords: RiskRecord[] = [
  {
    id: "RISK-1042",
    service: "Payments Gateway",
    region: "EU-West",
    severity: "critical",
    status: "investigating",
    owner: "Revenue Ops",
    signal: "Authorization failures above control limit",
    confidence: 94,
    impact: "$2.4M daily GMV exposure",
    slaHours: 2,
    trend: "up",
    lastSeen: "12 min ago",
    rootCause: "Issuer timeout variance increased after the routing policy update.",
    recommendedAction: "Shift 18% of traffic to the fallback acquirer and validate retry budget.",
    auditContext: "SOX payment continuity control PC-14 is in active watch."
  },
  {
    id: "RISK-1038",
    service: "Identity Provisioning",
    region: "Global",
    severity: "high",
    status: "open",
    owner: "IAM Platform",
    signal: "Privilege escalation requests outside baseline",
    confidence: 88,
    impact: "Delayed access reviews for 417 accounts",
    slaHours: 5,
    trend: "flat",
    lastSeen: "24 min ago",
    rootCause: "A partner import job is retrying stale entitlement bundles.",
    recommendedAction: "Pause bundle sync and require reviewer attestation before replay.",
    auditContext: "Maps to quarterly access certification control IAM-08."
  },
  {
    id: "RISK-1029",
    service: "Warehouse Forecasting",
    region: "US-Central",
    severity: "medium",
    status: "contained",
    owner: "Supply Chain",
    signal: "Demand model drift detected in priority SKUs",
    confidence: 81,
    impact: "Potential stockout risk across 29 locations",
    slaHours: 12,
    trend: "down",
    lastSeen: "41 min ago",
    rootCause: "Weather enrichment feed lagged behind the latest regional closures.",
    recommendedAction: "Run a bounded backfill and keep override thresholds in compact review.",
    auditContext: "Operational resilience evidence retained under SC-22."
  },
  {
    id: "RISK-1024",
    service: "Customer Data Lake",
    region: "AP-South",
    severity: "high",
    status: "investigating",
    owner: "Data Platform",
    signal: "PII classifier confidence dropped on inbound stream",
    confidence: 90,
    impact: "Manual quarantine for 7.8M events",
    slaHours: 4,
    trend: "up",
    lastSeen: "53 min ago",
    rootCause: "New source schema changed nested address fields without metadata.",
    recommendedAction: "Apply schema contract override and replay only quarantined partitions.",
    auditContext: "Privacy control DP-19 requires reviewer signoff before release."
  },
  {
    id: "RISK-1017",
    service: "Claims Workflow",
    region: "US-East",
    severity: "medium",
    status: "open",
    owner: "Insurance Ops",
    signal: "Manual override volume exceeded forecast",
    confidence: 74,
    impact: "SLA pressure on 1,260 claims",
    slaHours: 18,
    trend: "flat",
    lastSeen: "1 hr ago",
    rootCause: "A rule package changed how collision photos are classified.",
    recommendedAction: "Route low-value claims through accelerated review while tuning the rule.",
    auditContext: "Customer fairness sampling remains inside approved tolerance."
  },
  {
    id: "RISK-1009",
    service: "Partner Settlement",
    region: "LATAM",
    severity: "low",
    status: "contained",
    owner: "Finance Systems",
    signal: "Settlement file latency above normal band",
    confidence: 69,
    impact: "Next-day reconciliation window compressed",
    slaHours: 36,
    trend: "down",
    lastSeen: "2 hr ago",
    rootCause: "Bank export endpoint throttled after month-end reporting.",
    recommendedAction: "Keep batch splitting active until the partner confirms capacity.",
    auditContext: "Finance close control FC-03 is marked informational."
  }
];

export const kpiMetrics: KpiMetric[] = [
  {
    id: "open-risks",
    label: "Open risk signals",
    value: "42",
    delta: "+6 today",
    trend: "up",
    context: "13 require owner action"
  },
  {
    id: "critical-exposure",
    label: "Critical exposure",
    value: "$4.8M",
    delta: "-11%",
    trend: "down",
    context: "After containment routing"
  },
  {
    id: "median-sla",
    label: "Median SLA remaining",
    value: "6.4h",
    delta: "+1.2h",
    trend: "up",
    context: "Improved triage velocity"
  },
  {
    id: "automation-rate",
    label: "Automated decisions",
    value: "71%",
    delta: "stable",
    trend: "flat",
    context: "Manual review where required"
  }
];
