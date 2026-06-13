import { describe, expect, it } from "vitest";
import { riskRecords } from "../../data";
import {
  areRiskFiltersDefault,
  defaultRiskFilters,
  filterRiskRecords,
  getRiskRegions,
  toggleSeverityFilter
} from "./filters";

describe("risk filters", () => {
  it("filters records by query, status, region, and severity", () => {
    const filtered = filterRiskRecords(riskRecords, {
      ...defaultRiskFilters,
      query: "payments",
      status: "investigating",
      region: "EU-West",
      severities: ["critical"]
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("RISK-1042");
  });

  it("returns no records when any active constraint does not match", () => {
    expect(
      filterRiskRecords(riskRecords, {
        ...defaultRiskFilters,
        query: "payments",
        status: "contained"
      })
    ).toHaveLength(0);
  });

  it("does not allow severity filters to become empty accidentally", () => {
    const filters = toggleSeverityFilter({ ...defaultRiskFilters, severities: ["critical"] }, "critical");

    expect(filters.severities).toEqual(["critical"]);
  });

  it("detects the default filter state without depending on severity order", () => {
    expect(areRiskFiltersDefault({ ...defaultRiskFilters, severities: ["low", "medium", "high", "critical"] })).toBe(
      true
    );
    expect(areRiskFiltersDefault({ ...defaultRiskFilters, query: "payments" })).toBe(false);
    expect(areRiskFiltersDefault({ ...defaultRiskFilters, severities: ["critical"] })).toBe(false);
  });

  it("adds a severity back into the active filter set", () => {
    const filters = toggleSeverityFilter({ ...defaultRiskFilters, severities: ["critical"] }, "high");

    expect(filters.severities).toEqual(["critical", "high"]);
  });

  it("derives sorted unique regions for the filter control", () => {
    expect(getRiskRegions(riskRecords)).toEqual(["AP-South", "EU-West", "Global", "LATAM", "US-Central", "US-East"]);
  });
});
