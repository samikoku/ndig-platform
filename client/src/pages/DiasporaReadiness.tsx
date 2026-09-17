import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote,
  Fingerprint,
  Building2,
  BookOpen,
  Globe2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

type ColorKey = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "primary";

// Written as complete, static class strings (not interpolated) so Tailwind's
// content scanner can detect them at build time.
const colorClasses: Record<
  ColorKey,
  { card: string; iconBg: string; iconText: string; link: string; linkIcon: string }
> = {
  "chart-1": {
    card: "border-2 hover:border-chart-1 transition-colors",
    iconBg: "w-14 h-14 rounded-xl bg-chart-1/10 flex items-center justify-center mb-4",
    iconText: "w-7 h-7 text-chart-1",
    link: "flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-border hover:border-chart-1 hover:bg-muted/50 transition-colors group",
    linkIcon: "w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-chart-1 transition-colors",
  },
  "chart-2": {
    card: "border-2 hover:border-chart-2 transition-colors",
    iconBg: "w-14 h-14 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4",
    iconText: "w-7 h-7 text-chart-2",
    link: "flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-border hover:border-chart-2 hover:bg-muted/50 transition-colors group",
    linkIcon: "w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-chart-2 transition-colors",
  },
  "chart-3": {
    card: "border-2 hover:border-chart-3 transition-colors",
    iconBg: "w-14 h-14 rounded-xl bg-chart-3/10 flex items-center justify-center mb-4",
    iconText: "w-7 h-7 text-chart-3",
    link: "flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-border hover:border-chart-3 hover:bg-muted/50 transition-colors group",
    linkIcon: "w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-chart-3 transition-colors",
  },
  "chart-4": {
    card: "border-2 hover:border-chart-4 transition-colors",
    iconBg: "w-14 h-14 rounded-xl bg-chart-4/10 flex items-center justify-center mb-4",
    iconText: "w-7 h-7 text-chart-4",
    link: "flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-border hover:border-chart-4 hover:bg-muted/50 transition-colors group",
    linkIcon: "w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-chart-4 transition-colors",
  },
  primary: {
    card: "border-2 hover:border-primary transition-colors",
    iconBg: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4",
    iconText: "w-7 h-7 text-primary",
    link: "flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors group",
    linkIcon: "w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors",
  },
};

interface ReadinessLink {
  href: string;
  label: string;
}

interface ReadinessResource {
  icon: React.ElementType;
  color: ColorKey;
  category: string;
  agency: string;
  description: string;
  links: ReadinessLink[];
}

const resources: ReadinessResource[] = [
  {
    icon: Banknote,
    color: "chart-1",
    category: "BVN from Abroad",
    agency: "NIBSS NRBVN",
    description:
      "Open your Non-Resident Nigerian Ordinary Account and Non-Resident Nigerian Investment Account. 72-hour BVN issuance.",
    links: [{ href: "https://nibss-plc.com.ng/nrbvn", label: "nibss-plc.com.ng/nrbvn" }],
  },
  {
    icon: Fingerprint,
    color: "chart-2",
    category: "NIN from Abroad",
    agency: "NIMC",
    description: "National Identification Number enrolment for diaspora Nigerians.",
    links: [
      { href: "https://nimc.gov.ng/diaspora", label: "nimc.gov.ng/diaspora" },
      { href: "https://nimc.gov.ng/enrolment-centres", label: "nimc.gov.ng/enrolment-centres" },
    ],
  },
  {
    icon: Building2,
    color: "chart-3",
    category: "Investment Guidance",
    agency: "NIPC",
    description: "Nigerian Investment Promotion Commission — official investment guidance and incentives.",
    links: [{ href: "https://nipc.gov.ng", label: "nipc.gov.ng" }],
  },
  {
    icon: BookOpen,
    color: "chart-4",
    category: "Investment Guidance",
    agency: "iGuide Nigeria",
    description: "Official investor guide to Nigeria's regulatory environment, procedures, and opportunities.",
    links: [
      {
        href: "https://theiguides.org/public-docs/guides/nigeria",
        label: "theiguides.org/public-docs/guides/nigeria",
      },
    ],
  },
  {
    icon: Globe2,
    color: "primary",
    category: "Diaspora Services",
    agency: "NiDCOM",
    description: "Nigerians in Diaspora Commission — official diaspora services and engagement.",
    links: [{ href: "https://nidcom.gov.ng", label: "nidcom.gov.ng" }],
  },
];

export default function DiasporaReadiness() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
              <span className="text-sm font-medium text-chart-1 tracking-wide uppercase">
                Diaspora Readiness Desk
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
              Diaspora Readiness
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The Diaspora Readiness Desk provides direct links to official Nigerian government
              agency pages for diaspora members preparing to invest. Use these resources to get
              your documentation and identification in order before you begin.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {resources.map((resource) => {
              const Icon = resource.icon;
              const classes = colorClasses[resource.color];
              return (
                <Card key={resource.agency} className={classes.card}>
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div className={classes.iconBg}>
                      <Icon className={classes.iconText} />
                    </div>

                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                      {resource.category}
                    </p>
                    <h3 className="font-serif text-2xl font-bold mb-3">{resource.agency}</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 flex-grow">
                      {resource.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {resource.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.link}
                        >
                          <span className="text-sm font-medium truncate">{link.label}</span>
                          <ExternalLink className={classes.linkIcon} />
                        </a>
                      ))}
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This is an official external page. NDIG does not control or endorse the
                        content.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
