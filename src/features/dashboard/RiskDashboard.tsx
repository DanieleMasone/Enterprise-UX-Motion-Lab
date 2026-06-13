import { AnimatePresence, motion } from "motion/react";
import type { ChangeEvent, RefObject } from "react";
import { kpiMetrics, riskRecords, type KpiMetric, type RiskRecord, type RiskSeverity, type RiskStatus } from "../../data";
import type { DataState } from "../../app/app-state";
import { motionTokens } from "../../motion/motion.tokens";
import { getTransition } from "../../motion/transitions";
import { Button, DegradedBanner, EmptyState, SkeletonBlock, StatusBadge } from "../../ui";
import {
  areRiskFiltersDefault,
  defaultRiskFilters,
  filterRiskRecords,
  getRiskRegions,
  severityOrder,
  toggleSeverityFilter,
  type RiskFilters
} from "./filters";

export interface RiskDashboardProps {
  dataState: DataState;
  expandedId: string | null;
  filterSearchRef?: RefObject<HTMLInputElement | null>;
  filters: RiskFilters;
  reduceMotion: boolean;
  kpis?: KpiMetric[];
  records?: RiskRecord[];
  onClearFilters: () => void;
  onExpandedChange: (recordId: string | null) => void;
  onFiltersChange: (filters: RiskFilters) => void;
}

const statusOptions: Array<RiskStatus | "all"> = ["all", "open", "investigating", "contained"];

/**
 * Main enterprise risk dashboard surface.
 */
export function RiskDashboard({
  dataState,
  expandedId,
  filterSearchRef,
  filters,
  reduceMotion,
  kpis = kpiMetrics,
  records = riskRecords,
  onClearFilters,
  onExpandedChange,
  onFiltersChange
}: RiskDashboardProps) {
  const sourceRecords = dataState === "empty" ? [] : dataState === "degraded" ? records.slice(0, 4) : records;
  const filteredRecords = filterRiskRecords(sourceRecords, filters);
  const regions = getRiskRegions(records);
  const isFiltered = !areRiskFiltersDefault(filters);

  const updateQuery = (event: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, query: event.target.value });
  };

  const updateRegion = (event: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, region: event.target.value });
  };

  const updateStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: event.target.value as RiskStatus | "all" });
  };

  const toggleSeverity = (severity: RiskSeverity) => {
    onFiltersChange(toggleSeverityFilter(filters, severity));
  };

  return (
    <main className="dashboard" id="dashboard">
      <section className="dashboard__summary" aria-label="Risk summary">
        {kpis.map((metric, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="kpi-card"
            initial={{ opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.subtle }}
            key={metric.id}
            transition={{
              ...getTransition("list", reduceMotion),
              delay: reduceMotion ? 0 : index * motionTokens.stagger.listItem
            }}
          >
            <div className="kpi-card__topline">
              <span>{metric.label}</span>
              <span className={`trend trend--${metric.trend}`}>{metric.delta}</span>
            </div>
            <strong>{metric.value}</strong>
            <p>{metric.context}</p>
          </motion.article>
        ))}
      </section>

      <section className="dashboard__workbench" aria-labelledby="risk-queue-heading">
        <div className="dashboard__toolbar">
          <div>
            <h1 id="risk-queue-heading">Operational risk queue</h1>
            <p>
              {dataState === "loading"
                ? "Refreshing verified signals."
                : `${filteredRecords.length} visible signals across governed controls.`}
            </p>
          </div>
          <div className="dashboard__toolbar-meta">
            <StatusBadge label={dataState === "degraded" ? "degraded" : "live"} />
            <span>Updated 12 min ago</span>
          </div>
        </div>

        <DegradedBanner visible={dataState === "degraded"} />

        <motion.section
          className="filters"
          layout
          transition={getTransition("panel", reduceMotion)}
          aria-label="Risk filters"
        >
          <label className="field field--search">
            <span>Search</span>
            <input
              aria-label="Search risks"
              onChange={updateQuery}
              placeholder="Service, owner, signal, or region"
              ref={filterSearchRef}
              type="search"
              value={filters.query}
            />
          </label>
          <label className="field">
            <span>Region</span>
            <select aria-label="Filter by region" onChange={updateRegion} value={filters.region}>
              <option value="all">All regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select aria-label="Filter by status" onChange={updateStatus} value={filters.status}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : status}
                </option>
              ))}
            </select>
          </label>
          <div className="severity-filter" aria-label="Filter by severity">
            {severityOrder.map((severity) => (
              <motion.button
                aria-pressed={filters.severities.includes(severity)}
                className={`severity-filter__item severity-filter__item--${severity}`}
                key={severity}
                onClick={() => toggleSeverity(severity)}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: motionTokens.scale.press }}
                transition={getTransition("feedback", reduceMotion)}
              >
                {severity}
              </motion.button>
            ))}
          </div>
          <Button disabled={!isFiltered} onClick={onClearFilters} variant="ghost">
            Clear filters
          </Button>
        </motion.section>

        {dataState === "loading" ? (
          <SkeletonBlock rows={6} />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            actionLabel={isFiltered ? "Clear filters" : undefined}
            message={
              isFiltered
                ? "No signals match the current search, severity, region, and status constraints."
                : "No verified signals are currently in the operational queue."
            }
            onAction={isFiltered ? onClearFilters : undefined}
            title={isFiltered ? "No risk signals match filters" : "No verified risk signals"}
          />
        ) : (
          <RiskTable
            expandedId={expandedId}
            records={filteredRecords}
            reduceMotion={reduceMotion}
            onExpandedChange={onExpandedChange}
          />
        )}
      </section>
    </main>
  );
}

interface RiskTableProps {
  expandedId: string | null;
  records: RiskRecord[];
  reduceMotion: boolean;
  onExpandedChange: (recordId: string | null) => void;
}

function RiskTable({ expandedId, records, reduceMotion, onExpandedChange }: RiskTableProps) {
  const toggleExpanded = (recordId: string) => {
    onExpandedChange(expandedId === recordId ? null : recordId);
  };

  return (
    <div className="risk-table-shell">
      <table className="risk-table">
        <caption>Dense anomaly and risk signal table</caption>
        <thead>
          <tr>
            <th scope="col">Signal</th>
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
            <th scope="col">Owner</th>
            <th scope="col">Confidence</th>
            <th scope="col">SLA</th>
            <th scope="col">Impact</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <RiskTableRow
              expanded={expandedId === record.id}
              key={record.id}
              onToggle={() => toggleExpanded(record.id)}
              record={record}
              reduceMotion={reduceMotion}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RiskTableRowProps {
  expanded: boolean;
  record: RiskRecord;
  reduceMotion: boolean;
  onToggle: () => void;
}

function RiskTableRow({ expanded, record, reduceMotion, onToggle }: RiskTableRowProps) {
  return (
    <>
      <motion.tr
        animate={{ opacity: 1 }}
        className={expanded ? "risk-table__row risk-table__row--expanded" : "risk-table__row"}
        initial={{ opacity: 0.86 }}
        transition={getTransition("feedback", reduceMotion)}
      >
        <th scope="row">
          <span className="risk-table__id">{record.id}</span>
          <span className="risk-table__service">{record.service}</span>
          <span className="risk-table__signal">{record.signal}</span>
          <span className="risk-table__mobile-meta">
            {record.region} | {record.lastSeen}
          </span>
        </th>
        <td>
          <StatusBadge label={record.severity} />
        </td>
        <td>
          <StatusBadge label={record.status} />
        </td>
        <td>{record.owner}</td>
        <td>
          <span
            aria-label={`${record.confidence}% confidence`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={record.confidence}
            className="confidence-meter"
            role="meter"
          >
            <span style={{ width: `${record.confidence}%` }} />
          </span>
          {record.confidence}%
        </td>
        <td>{record.slaHours}h</td>
        <td>{record.impact}</td>
        <td>
          <Button aria-expanded={expanded} aria-controls={`${record.id}-detail`} onClick={onToggle} variant="ghost">
            {expanded ? "Hide" : "View"}
          </Button>
        </td>
      </motion.tr>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.tr
            animate={{ opacity: 1 }}
            className="risk-table__detail-row"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={getTransition("panel", reduceMotion)}
          >
            <td colSpan={8}>
              <motion.div
                animate={{ height: "auto", opacity: 1, y: 0 }}
                className="risk-detail"
                exit={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -motionTokens.distance.subtle }}
                id={`${record.id}-detail`}
                initial={{ height: 0, opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.subtle }}
                transition={getTransition("panel", reduceMotion)}
              >
                <div>
                  <span>Root cause</span>
                  <p>{record.rootCause}</p>
                </div>
                <div>
                  <span>Recommended action</span>
                  <p>{record.recommendedAction}</p>
                </div>
                <div>
                  <span>Audit context</span>
                  <p>{record.auditContext}</p>
                </div>
              </motion.div>
            </td>
          </motion.tr>
        ) : null}
      </AnimatePresence>
    </>
  );
}
