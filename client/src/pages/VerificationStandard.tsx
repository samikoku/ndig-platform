import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Clock, CalendarClock, XCircle, AlertCircle } from "lucide-react";

const ninePoints = [
  "Regulatory registration - confirmed active registration with the relevant Nigerian regulator (SEC, CBN, NIPC, etc.)",
  "Licensing verification - valid, current operating licence for the specific product or service offered",
  "Corporate transparency - verifiable ownership structure and registered corporate address",
  "Financial health review - review of publicly available financial standing and audit history",
  "Track record audit - history of prior offerings, redemptions, and completed obligations",
  "Complaint history check - review of public regulatory actions, sanctions, or unresolved disputes",
  "Data security assessment - baseline check of how investor data and documentation are handled",
  "Dispute resolution mechanism - a documented process for handling investor complaints",
  "Ongoing monitoring - continued review for as long as the partner remains listed on NDIG",
];

export default function VerificationStandard() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Verification Standard</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              How We Vet Every Partner
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Every institution listed on NDIG passes a nine-point verification gate before appearing
              on the platform - and is reviewed on an ongoing basis afterward.
            </p>
          </div>
        </div>
      </section>

      {/* Nine points */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {ninePoints.map((point, idx) => (
              <div key={point} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{idx + 1}</span>
                </div>
                <p className="text-sm md:text-base">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Assurance Code */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">The Partner Assurance Code</h2>
            <p className="text-muted-foreground">
              Every institution that passes the nine-point gate is issued a Partner Assurance Code -
              a reference you can quote when contacting NDIG's Trust Centre about any partner listed
              on the platform.
            </p>
          </div>
        </div>
      </section>

      {/* SLA and delisting */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">48-Hour Response</h3>
                <p className="text-sm text-muted-foreground">
                  Every advocacy request raised through the Trust Centre receives an initial response
                  within 48 hours.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4">
                  <CalendarClock className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="font-bold text-lg mb-2">15 Working Days to Resolution</h3>
                <p className="text-sm text-muted-foreground">
                  NDIG's Advocacy SLA targets full resolution of a raised issue within 15 working days.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-bold text-lg mb-2">Public Delisting</h3>
                <p className="text-sm text-muted-foreground">
                  Three SLA breaches within 12 months result in the partner being publicly delisted
                  from NDIG.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mt-12 flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              NDIG does not guarantee the products or performance of any partner institution.
              Verification confirms that a partner meets NDIG's listing standard at the time of review -
              it is not investment advice and does not eliminate investment risk.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
