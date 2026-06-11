import { describe, expect, it } from "vitest";
import { riskRecords } from "../../data";
import { defaultRiskFilters, filterRiskRecords, getRiskRegions, toggleSeverityFilter } from "./filters";

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

  it("does not allow severity filters to become empty accidentally", () => {
    const filters = toggleSeverityFilter({ ...defaultRiskFilters, severities: ["critical"] }, "critical");

    expect(filters.severities).toEqual(["critical"]);
  });

  it("derives sorted unique regions for the filter control", () => {
    expect(getRiskRegions(riskRecords)).toEqual(["AP-South", "EU-West", "Global", "LATAM", "US-Central", "US-East"]);
  });
});
