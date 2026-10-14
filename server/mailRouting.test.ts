import { describe, expect, it } from "vitest";
import { AUTO_REPLY_TEMPLATES, MAIL_ROUTES, assertRoutable } from "./mailRouting";

describe("mail routing", () => {
  it("routes each category to its mailbox", () => {
    expect(MAIL_ROUTES.verification.to).toBe("info@ndigateway.org");
    expect(MAIL_ROUTES.verification.subjectPrefix).toBe("[VERIFY]");
    expect(MAIL_ROUTES.execution.to).toBe("execution@ndigateway.org");
    expect(MAIL_ROUTES.redress.to).toBe("redress@ndigateway.org");
    expect(MAIL_ROUTES.press.to).toBe("press@ndigateway.org");
  });

  it("never routes automated mail to the Chairman's address", () => {
    for (const r of Object.values(MAIL_ROUTES)) {
      expect(r.to).not.toMatch(/smi@/i);
      expect(r.replyFrom).not.toMatch(/smi@/i);
    }
    expect(() => assertRoutable("smi@ndigateway.org")).toThrow();
    expect(() => assertRoutable("Founder <SMI@ndigateway.org>")).toThrow();
  });

  it("execution and redress auto-replies state third-party delivery", () => {
    for (const c of ["execution", "redress"] as const) {
      const t = AUTO_REPLY_TEMPLATES[c]({ name: "Ada", reference: "NDIG-2026-948A1C" });
      expect(t.html).toContain("always delivered through verified third parties");
    }
  });

  it("escapes submitter names", () => {
    const t = AUTO_REPLY_TEMPLATES.press({ name: "<b>x</b>" });
    expect(t.html).not.toContain("<b>x</b>");
  });
});
