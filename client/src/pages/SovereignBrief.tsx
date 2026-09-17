import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft, Calendar } from "lucide-react";

interface Edition {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
}

const editions: Edition[] = [
  {
    slug: "2026-08-edition",
    title: "August 2026: CBN's NRNIA Framework One Year On",
    date: "August 2026",
    summary: "A look at adoption of the Non-Resident Nigerian Investment Account since its January 2025 launch.",
    body: [
      "Since launch, NRNIA enrolment has grown steadily as diaspora banks expand digital onboarding.",
      "This edition reviews enrolment trends, repatriation activity, and what it means for diaspora bond demand ahead of the next issuance window.",
    ],
  },
  {
    slug: "2026-07-edition",
    title: "July 2026: Diaspora Remittances and the Productive Investment Gap",
    date: "July 2026",
    summary: "Nigeria's 2024 remittance figures against the size of the productive-investment opportunity still untapped.",
    body: [
      "Formal remittance channels continue to grow following IMTO reforms, but the vast majority of inflows remain consumption-driven.",
      "This edition sets out the scale of the gap between remittances and productive investment, and what a functioning trust layer could unlock.",
    ],
  },
  {
    slug: "2026-06-edition",
    title: "June 2026: What the NRBVN Rollout Means for Diaspora Banking",
    date: "June 2026",
    summary: "A plain-language look at Non-Resident BVN enrolment and why it matters for diaspora investors.",
    body: [
      "NRBVN enrolment removes one of the largest historical barriers to diaspora banking: the need to travel to Nigeria in person.",
      "This edition walks through the enrolment process and how it connects to NRNIA account opening.",
    ],
  },
];

export default function SovereignBrief() {
  const params = useParams();
  const edition = editions.find((e) => e.slug === params.slug);

  if (!edition) {
    return (
      <div className="flex flex-col w-full py-24">
        <div className="container px-4 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Edition Not Found</h1>
          <p className="text-muted-foreground mb-6">This Sovereign Brief edition doesn't exist yet.</p>
          <Link href="/sovereign-brief" className="text-primary hover:underline">
            Browse all editions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <section className="py-16 md:py-20 bg-sidebar text-sidebar-foreground">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/sovereign-brief" className="inline-flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-gold transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> All Editions
            </Link>
            <div className="flex items-center gap-2 text-gold text-sm uppercase tracking-widest mb-4">
              <Calendar className="w-4 h-4" /> {edition.date}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">{edition.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground italic">{edition.summary}</p>
            {edition.body.map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function SovereignBriefIndex() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Sovereign Brief</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              The Sovereign Brief
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              NDIG's periodic briefing on Nigeria's diaspora investment infrastructure, policy, and
              opportunity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {editions.map((edition) => (
              <Link key={edition.slug} href={`/sovereign-brief/${edition.slug}`}>
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" /> {edition.date}
                    </div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">{edition.title}</h2>
                    <p className="text-muted-foreground text-sm">{edition.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
