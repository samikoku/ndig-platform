import { describe, expect, it } from "vitest";
import { checkBeforeSend } from "./newsletterRouting";

describe("newsletter pre-send check", () => {
  it("passes a draft with no verdicts", () => {
    expect(checkBeforeSend({ subject: "s", bodyHtml: "<p>Plain analysis.</p>" }).ok).toBe(true);
  });

  it("blocks a VERIFIED claim sourced from the Intelligence Brief", () => {
    const r = checkBeforeSend({ subject: "s", bodyHtml: "<p>x</p>", claims: [{ verdict: "VERIFIED", source: "INTEL_BRIEF", logEntryId: "L-1" }] });
    expect(r.ok).toBe(false);
  });

  it("blocks a FAILED claim with no log entry", () => {
    const r = checkBeforeSend({ subject: "s", bodyHtml: "<p>x</p>", claims: [{ verdict: "FAILED", source: "PUBLIC_RECORD" }] });
    expect(r.ok).toBe(false);
  });

  it("passes a log-backed VERIFIED claim from a public record", () => {
    const r = checkBeforeSend({ subject: "s", bodyHtml: "<p>x</p>", claims: [{ verdict: "VERIFIED", source: "PUBLIC_RECORD", logEntryId: "L-2" }] });
    expect(r.ok).toBe(true);
  });

  it("blocks body text that cites the Intelligence Brief for a verdict", () => {
    const r = checkBeforeSend({ subject: "s", bodyHtml: "<p>VERIFIED, per the NDIG-NAKACHI Intelligence Brief.</p>" });
    expect(r.ok).toBe(false);
  });

  it("allows the Brief to be named in a paragraph with no verdict", () => {
    expect(checkBeforeSend({ subject: "s", bodyHtml: "<p>The Intelligence Brief is the first document you receive.</p>" }).ok).toBe(true);
  });
});
