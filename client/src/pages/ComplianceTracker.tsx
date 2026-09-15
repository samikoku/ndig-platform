import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Shield, Building2, Landmark } from "lucide-react";

export default function ComplianceTracker() {
  const complianceItems = [
    {
      agency: "SEC (Securities and Exchange Commission)",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      status: "Fully Compliant",
      frameworks: [
        "Investment and Securities Act 2007",
        "Collective Investment Schemes Regulations",
        "Foreign Portfolio Investment Guidelines",
        "Investor Protection Framework",
      ],
      description: "All investment products on NDIG are registered with SEC and comply with capital market regulations.",
    },
    {
      agency: "CBN (Central Bank of Nigeria)",
      icon: Landmark,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      status: "Fully Compliant",
      frameworks: [
        "Foreign Exchange Manual",
        "Diaspora Remittance Guidelines",
        "Investment Repatriation Policy",
        "Naira for Dollar Scheme Compliance",
      ],
      description: "NDIG operates within CBN's monetary policy framework and forex regulations for diaspora investments.",
    },
    {
      agency: "NIPC (Nigeria Investment Promotion Commission)",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      status: "Fully Compliant",
      frameworks: [
        "Nigerian Investment Promotion Commission Act",
        "Pioneer Status Incentive Guidelines",
        "Investment Registration Requirements",
        "Dispute Resolution Framework",
      ],
      description: "All investment opportunities are vetted and registered with NIPC, ensuring investor protection.",
    },
    {
      agency: "NiDCOM (Nigerians in Diaspora Commission)",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      status: "Fully Aligned",
      frameworks: [
        "Diaspora Engagement Policy",
        "National Housing Fund Integration",
        "Diaspora Investment Summit Framework",
        "Identity Verification Standards (NIN)",
      ],
      description: "NDIG screens opportunities against NiDCOM frameworks and aligns with the National Diaspora Policy.",
    },
  ];

  const keyPolicies = [
    {
      title: "National Productivity Agenda 2025-2035",
      description: "NDIG is a flagship initiative under the NPA, channeling diaspora capital into productive sectors.",
      status: "Core Alignment",
    },
    {
      title: "Economic Recovery & Growth Plan (ERGP)",
      description: "Supports infrastructure, agriculture, and manufacturing investments prioritized in the ERGP.",
      status: "Strategic Fit",
    },
    {
      title: "National Development Plan 2021-2025",
      description: "Contributes to job creation, GDP growth, and forex stabilization targets.",
      status: "Policy Contributor",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container py-12 px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Government Compliance & Regulatory Alignment
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Compliance Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            NDIG operates in full compliance with Nigerian regulatory frameworks, ensuring your investments are secure, transparent, and legally protected.
          </p>
        </div>

        {/* Compliance Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {complianceItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{item.agency}</CardTitle>
                      <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Key Frameworks:</p>
                    <ul className="space-y-1">
                      {item.frameworks.map((framework, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{framework}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* National Policy Alignment */}
        <Card className="border-border mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">National Policy Alignment</CardTitle>
            <p className="text-muted-foreground">
              NDIG is strategically aligned with Nigeria's key national development policies and economic frameworks.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {keyPolicies.map((policy, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h3 className="font-bold text-sm mb-2">{policy.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{policy.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {policy.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investor Protection Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-3">
              <Shield className="w-7 h-7 text-primary" />
              Investor Protection Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Legal Safeguards</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>All investments are backed by legally binding contracts registered with NIPC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Dispute resolution mechanisms through NIPC and SEC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Capital repatriation guaranteed under CBN forex policies</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Transparency Standards</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Quarterly investment performance reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Real-time portfolio tracking and valuation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Independent third-party audits of all investment vehicles</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
