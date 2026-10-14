import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DossierCard, { type DossierCardProps } from "@/components/verification/DossierCard";

// Sample dossiers for the Trust Centre. Fictional subjects; cards render "Illustrative example".
const VERIFICATION_EXAMPLES: Array<{ heading: string; explanation: string; card: DossierCardProps }> = [
  {
    heading: "Confirmed",
    explanation:
      "The institution or instrument appears on the public regulatory records we checked, and the details you gave us match them: name, registration and licence status. A confirmed dossier records what was true on the date of the check. It is not investment advice, and it does not mean NDIG recommends the opportunity.",
    card: {
      reference: "NDIG-VD-26-A41C07",
      date: "2026-10-06",
      subject: "Example Asset Management Ltd: fund manager licence",
      checkedAgainst: "SEC Nigeria register of capital market operators; CAC public search",
      status: "CONFIRMED",
    },
  },
  {
    heading: "Flagged",
    explanation:
      "Something did not match, or could not be confirmed from public records: a licence that has lapsed, a name that differs from the register, or a record we could not find. A flag is a reason to stop and ask questions before you send money. The dossier lists exactly what we found so you can raise it with the provider.",
    card: {
      reference: "NDIG-VD-26-B90E52",
      date: "2026-10-08",
      subject: "Sample Homes Development Co.: off-plan estate offer",
      checkedAgainst: "CAC public search; state land registry notice",
      status: "FLAGGED",
    },
  },
  {
    heading: "Rejected",
    explanation:
      "The institution or instrument is not on the register it claims to be on, or a regulator has issued a public warning against it. Do not send money. If you have already paid, contact the regulator named in the dossier and reach out to NDIG.",
    card: {
      reference: "NDIG-VD-26-C3D418",
      date: "2026-10-09",
      subject: "Placeholder Diaspora Yield Fund: 30% monthly return scheme",
      checkedAgainst: "SEC Nigeria register; SEC public warnings list",
      status: "REJECTED",
    },
  },
];

/** Trust Centre: "What verification looks like" — the three verdicts side by side. */
export default function VerificationExamples() {
  return (
        <section className="max-w-6xl mx-auto mt-20" aria-labelledby="verification-examples-heading">
          <div className="text-center mb-10 md:mb-12">
            <h2 id="verification-examples-heading" className="font-serif text-3xl md:text-4xl font-bold mb-4">
              What verification looks like
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {VERIFICATION_EXAMPLES.map((ex) => (
              <div key={ex.card.status} className="flex flex-col items-center lg:items-stretch">
                <DossierCard {...ex.card} illustrative />
                <p className="mt-5 max-w-[420px] text-sm md:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{ex.heading}.</strong> {ex.explanation}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/verify-opportunity">
              <Button size="lg" className="gap-2">
                Verify an Opportunity
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
  );
}
