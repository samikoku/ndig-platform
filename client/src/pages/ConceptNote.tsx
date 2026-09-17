import { FileText } from "lucide-react";

export default function ConceptNote() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Concept Note</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              The NDIG Concept
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Why a trust layer, not another remittance channel, is what turns diaspora money into
              national infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-10 text-sm md:text-base leading-relaxed text-foreground">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">The Problem</h2>
              <p>
                Nigeria's diaspora sends an estimated $20.9B home every year - overwhelmingly into
                consumption rather than productive investment. The instruments to convert that flow into
                lasting wealth already exist: diaspora bonds, NRNIA accounts, vetted development
                projects. What has been missing is not opportunity, but a trusted, verified front door to
                it. At least 3x of that annual inflow is channelable into productive investment once a
                trust layer exists.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">The NDIG Model: Inform, Verify, Connect</h2>
              <p className="mb-3">
                NDIG is a private-sector information, verification and distribution infrastructure -
                not a marketplace, not a fund, and not a bank.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>We Inform</strong> - verified, plain-language intelligence on legitimate
                  Nigerian investment opportunities, monitored daily against DMO, CBN, NIPC, and NiDCOM.
                </li>
                <li>
                  <strong>We Verify</strong> - every institution, product, and project is screened
                  against the relevant regulator through our nine-point vetting gate before it is ever
                  listed.
                </li>
                <li>
                  <strong>We Connect</strong> - diaspora investors go directly to the regulated
                  institution named. NDIG never advises, never holds funds, and never stands between an
                  investor and their money.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Why Scarcity Is the Design</h2>
              <p>
                NDIG works with a small, fixed number of institutional partners - never a marketplace of
                every possible option. Fewer, more deeply verified partners means every listing is
                traceable, every fee disclosed, and every claim checked. Ultra-transparency depends on
                NDIG staying small enough to actually verify what it publishes.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Who Operates NDIG</h2>
              <p>
                NDIG is founded and operated by NAKACHI Consulting, an established Nigerian consulting
                firm with decades of experience in diaspora engagement, productivity consulting, and
                public-private partnerships.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Further Reading</h2>
              <p>
                For ongoing analysis of Nigeria's diaspora investment infrastructure, policy, and
                opportunity, see{" "}
                <a href="/sovereign-brief" className="text-primary font-medium hover:underline">
                  The Sovereign Brief
                </a>
                .
              </p>
            </div>

            <p className="text-xs text-muted-foreground pt-6 border-t border-border">
              NDIG does not provide investment advice, and does not collect or hold investor funds. All
              investments are made directly with the licensed institutions named.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
