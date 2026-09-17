import { Button } from "@/components/ui/button";
import { ExternalLink, Home, AlertCircle } from "lucide-react";

const HOMEFUND_URL = "https://homefund.ng";

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
              HomeFund NG
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Nigeria's diaspora housing initiative - a dedicated platform for financing and building
              your home in Nigeria from abroad.
            </p>
            <div className="pt-4">
              <a href={HOMEFUND_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-sidebar gap-2">
                  Go to HomeFund NG
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
              HomeFund NG is an independent housing initiative. NDIG provides a direct link to
              HomeFund NG's own platform and does not process housing applications, payments, or
              approvals on its behalf.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
