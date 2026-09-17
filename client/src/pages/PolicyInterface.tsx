import { Landmark, Clock } from "lucide-react";

export default function PolicyInterface() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <Landmark className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Policy & Governance</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Policy Interface
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              A direct channel for diaspora investors to engage the legislative and regulatory
              discussions that shape the instruments they invest in.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gold/30 bg-gold/5">
              <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold mb-1">Coming Soon</h2>
                <p className="text-sm text-muted-foreground">
                  The interactive Policy Interface - where registered diaspora investors can follow and
                  comment on legislative discussions affecting diaspora bonds, NRNIA/NRBVN
                  infrastructure, and investment policy - is in development ahead of full platform
                  launch.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base leading-relaxed text-muted-foreground">
              <p>
                Diaspora investors have a direct stake in the policy environment their money depends on.
                NDIG's Policy Interface will give the diaspora a structured, verified way to follow
                proposed legislation and regulatory changes from CBN, SEC, and NIPC as they relate to
                diaspora investment, and to submit feedback through NDIG for onward transmission to the
                relevant body.
              </p>
              <p>
                As with every other part of NDIG, this module will inform and connect - it will never
                provide investment advice, and NDIG will never hold or transmit funds on your behalf.
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
