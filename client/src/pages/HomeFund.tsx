import { Button } from "@/components/ui/button";
import { ExternalLink, Home, AlertCircle } from "lucide-react";

const FMBN_URL =
  "https://fmbn.gov.ng/resources/news/fmbn-opens-secure-pathway-for-nigerians-abroad-to-own-homes-in-nigeria-with-official-launch-of-diaspora-mortgage-product";

export default function HomeFund() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
              <Home className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              FMBN Diaspora Mortgage
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              The Federal Mortgage Bank of Nigeria launched its NHF Diaspora Mortgage Loan in London on 7 August 2026.
              Eligible contributors can access up to ₦100 million at 9% per annum over a maximum of 10 years, subject to
              affordability and applicable requirements.
            </p>
            <p className="text-sm text-gray-400">
              Source: FMBN press release on the launch (fmbn.gov.ng). The FMBN release names NiDCOM and the Central Bank
              of Nigeria among the institutions present. Terms are FMBN's; confirm them with FMBN before relying on them.
            </p>
            <div className="pt-4">
              <a href={FMBN_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-sidebar gap-2">
                  Read the FMBN announcement
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-xl mx-auto flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              NDIG links to FMBN's own announcement. NDIG does not process mortgage applications, payments or approvals,
              and does not recommend this product. NDIG has not verified FMBN's lending terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
