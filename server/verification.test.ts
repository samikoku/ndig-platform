import { describe, expect, it } from "vitest";
import { REFERENCE_PATTERN, checkedAgainstFor, generateDossierReference } from "./verification";

describe("verification dossiers", () => {
  it("generates references in the public format", () => {
    const ref = generateDossierReference(new Date("2026-10-14T12:00:00Z"));
    expect(ref).toMatch(/^NDIG-VD-26-[0-9A-F]{8}$/);
    expect(REFERENCE_PATTERN.test(ref)).toBe(true);
  });

  it("generates distinct references", () => {
    const refs = new Set(Array.from({ length: 500 }, () => generateDossierReference()));
    expect(refs.size).toBe(500);
  });

  it("always includes CAC in the records checked", () => {
    expect(checkedAgainstFor("SEC")).toBe("SEC Nigeria register; CAC public search");
    expect(checkedAgainstFor(undefined)).toBe("Relevant regulator's public register; CAC public search");
    expect(checkedAgainstFor("Unknown")).toContain("CAC public search");
  });

  it("rejects malformed references", () => {
    expect(REFERENCE_PATTERN.test("NDIG-VD-26-ZZZZ")).toBe(false);
    expect(REFERENCE_PATTERN.test("ndig-vd-26-4f1a09c2")).toBe(false);
  });
});
