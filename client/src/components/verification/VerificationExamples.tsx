import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DossierCard from "@/components/verification/DossierCard";
import { VERIFICATION_EXAMPLES } from "@/config/siteCopy";

/** Trust Centre: "What verification looks like" — the three verdicts side by side. */
export default function VerificationExamples() {
  return (
    <section className="max-w-6xl mx-auto mt-20" aria-labelledby="verification-examples-heading">
      <div className="text-center mb-10 md:mb-12">
        <h2 id="verification-examples-heading" className="font-serif text-3xl md:text-4xl font-bold mb-4">
          {VERIFICATION_EXAMPLES.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
        {VERIFICATION_EXAMPLES.items.map((ex) => (
          <div key={ex.card.status} className="flex flex-col items-center lg:items-stretch">
            <DossierCard {...ex.card} illustrative />
            <p className="mt-5 max-w-[520px] text-sm md:text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{ex.heading}.</strong> {ex.explanation}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/verify-opportunity">
          <Button size="lg" className="gap-2">
            {VERIFICATION_EXAMPLES.cta}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
