import { Scale } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <Scale className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Terms of Service</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Last updated: 18 September 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-10 text-sm md:text-base leading-relaxed text-foreground">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">1. What NDIG Is</h2>
              <p>
                NDIG (Nigeria Diaspora Investment Gateway), operated by NAKACHI Consulting, is an
                information, verification and distribution infrastructure connecting the Nigerian
                diaspora to regulator-vetted investment opportunities. By using www.ndigateway.org or
                any NDIG service, you agree to these Terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">2. What NDIG Is Not</h2>
              <p>
                NDIG does not provide investment advice, does not recommend specific investments, does
                not hold, collect, or transmit investor funds, and does not act as an intermediary in
                any transaction between you and a licensed institution. NDIG is not a payment service
                provider, broker-dealer, or fund manager.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">3. Direct Engagement With Licensed Institutions</h2>
              <p>
                Every investment facilitated through NDIG is made directly between you and the licensed
                institution named (for example, the Debt Management Office for diaspora bonds, a bank
                for NRNIA/NRBVN accounts, or NIPC for investment projects). That institution's own terms,
                disclosures, and regulatory obligations govern the transaction - not NDIG's.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">4. Referral Codes</h2>
              <p>
                When you register interest, NDIG issues you a unique referral code. The code is a
                tracking reference only - quoting it when you pay a licensed institution allows that
                institution to attribute your investment to your registration. Referral codes carry no
                monetary value, cannot be transferred or sold, and do not constitute a financial
                instrument.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">5. Country Anchors</h2>
              <p>
                Individuals accepted into the Country Anchor programme act strictly as introducers -
                informing, introducing, verifying, supporting, representing, and reporting on behalf of
                NDIG in their country of residence. Country Anchors never provide investment advice and
                never handle investor funds. Anchor-specific terms are set out in the Country Anchor
                Covenant signed during onboarding; see{" "}
                <Link href="/country-anchors" className="text-primary font-medium hover:underline">
                  Country Anchors
                </Link>{" "}
                for programme details.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">6. Verification, Not Guarantee</h2>
              <p>
                Institutions and opportunities listed on NDIG have passed our nine-point verification
                gate at the time of listing and are reviewed on an ongoing basis. Verification confirms
                a partner meets NDIG's listing standard - it is not a guarantee of that partner's
                products, performance, or solvency, and does not eliminate investment risk. See{" "}
                <Link href="/verification-standard" className="text-primary font-medium hover:underline">
                  Verification Standard
                </Link>{" "}
                for full detail.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, NDIG and NAKACHI Consulting are not liable for
                any loss arising from an investment decision you make, from your dealings with a
                licensed institution, or from your reliance on information published on the platform.
                NDIG's role is limited to information, verification, and introduction.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">8. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the Federal Republic of Nigeria, without regard
                to conflict-of-law principles.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">9. Contact</h2>
              <p>
                Questions about these Terms should be sent to{" "}
                <a href="mailto:ndig@nakachiconsulting.com.ng" className="text-primary font-medium hover:underline">
                  ndig@nakachiconsulting.com.ng
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
