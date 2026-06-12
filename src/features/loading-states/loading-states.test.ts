import { describe, expect, it } from "vitest";
import { getDataStateCopy } from "./loading-states";

describe("loading state copy", () => {
  it("describes each resilience state with operational language", () => {
    expect(getDataStateCopy("live")).toEqual({
      label: "Live telemetry",
      description: "Verified signals are available for triage."
    });
    expect(getDataStateCopy("loading").description).toContain("Skeleton rows");
    expect(getDataStateCopy("empty").label).toBe("No active signals");
    expect(getDataStateCopy("degraded").description).toContain("ingestion freshness");
  });
});
