import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Shield,
  Globe2,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Banknote,
  FileCheck,
  Lock
} from "lucide-react";

export default function BankingOptions() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="absolute inset-0 bg-[url('/images/hero-banner.jpg')] opacity-10 bg-cover bg-center" />

        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
              <span className="text-sm font-medium text-chart-1 tracking-wide uppercase">
                CBN-Backed Infrastructure
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
              Your Country is <span className="text-primary">Ready for You</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The Central Bank of Nigeria has launched comprehensive banking infrastructure specifically designed for Nigerians in the diaspora. Open accounts, invest safely, and manage your funds with full government backing.
            </p>
          </div>
        </div>
      </section>

      {/* Non-Resident Nigerian Accounts Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              Non-Resident Nigerian Accounts
            </h2>
            <p className="text-lg text-muted-foreground">
              Launched January 2025 by the Central Bank of Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* NRNOA Card */}
            <Card className="border-2 hover:border-chart-1 transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-chart-1/10 flex items-center justify-center mb-6">
                  <Banknote className="w-8 h-8 text-chart-1" />
                </div>

                <h3 className="font-serif text-2xl font-bold mb-3">
                  NRNOA
                </h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Non-Resident Nigerian Ordinary Account
                </p>

                <p className="text-lg mb-6">
                  Manage remittances and daily transactions with full control over your funds in both foreign and local currencies.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Hold funds in USD, GBP, EUR, or Naira</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Send money to family and pay bills in Nigeria</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Reduce reliance on third-party services</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Manage local commitments directly</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Who it's for:</p>
                  <p className="text-sm text-muted-foreground">
                    Diaspora managing family obligations and local commitments
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* NRNIA Card */}
            <Card className="border-2 border-primary hover:border-primary/80 transition-all bg-primary/5">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-serif text-2xl font-bold mb-3">
                  NRNIA
                </h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Non-Resident Nigerian Investment Account
                </p>

                <p className="text-lg mb-6">
                  Invest in Nigerian assets and build wealth with full government backing and repatriation rights.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">Participate in Diaspora Bonds</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Invest in stocks, real estate, and infrastructure</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Hold investments in FCY or Naira</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Full capital and profit repatriation rights</p>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">NDIG Integration:</p>
                  <p className="text-sm">
                    All NDIG investments are settled through your NRNIA account for maximum security and transparency.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="gap-2">
              Open Your NRNIA Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* NRBVN Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-2/10 border border-chart-2/20 mb-6">
                  <FileCheck className="w-4 h-4 text-chart-2" />
                  <span className="text-sm font-medium text-chart-2 tracking-wide uppercase">
                    Launched May 2025
                  </span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Non-Resident BVN (NRBVN)
                </h2>
                <p className="text-xl mb-6">
                  Get Your BVN from Anywhere in the World — No Travel Required
                </p>

                <p className="text-muted-foreground mb-6">
                  The CBN and NIBSS have launched the Non-Resident BVN platform, allowing you to obtain your Bank Verification Number without traveling to Nigeria.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-chart-2">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Visit NIBSS NRBVN Portal</p>
                      <p className="text-sm text-muted-foreground">Complete online application</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-chart-2">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Submit Identity Documents</p>
                      <p className="text-sm text-muted-foreground">Upload passport, proof of address</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-chart-2">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Biometric Verification</p>
                      <p className="text-sm text-muted-foreground">At Nigerian embassy/consulate</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-chart-2">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Receive Your BVN</p>
                      <p className="text-sm text-muted-foreground">Within 48 hours</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="gap-2">
                  Get Your NRBVN Now
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <Card>
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold mb-4">
                    Why You Need a BVN
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Required to open NRNOA and NRNIA accounts</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Access banking, mortgages, pensions, and insurance</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Verify your identity for all financial transactions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Participate in capital markets and investments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Remittance Infrastructure Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              Remittance Infrastructure
            </h2>
            <p className="text-xl text-muted-foreground">
              Fast, Secure, Transparent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-chart-1 mb-2">$20.9B</div>
                <p className="text-sm text-muted-foreground">Total Remittances (2024)</p>
                <p className="text-xs text-muted-foreground mt-1">+8.9% Year-over-Year</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-chart-1 mb-2">$553M</div>
                <p className="text-sm text-muted-foreground">Record Monthly Inflow</p>
                <p className="text-xs text-muted-foreground mt-1">July 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-chart-1 mb-2">$1B</div>
                <p className="text-sm text-muted-foreground">CBN Monthly Target</p>
                <p className="text-xs text-muted-foreground mt-1">By 2026</p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold mb-6">
                CBN's 2024 Remittance Reforms
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Revised IMTO Framework (January 2024)</p>
                    <p className="text-sm text-muted-foreground">
                      Strengthened licensing and operations framework for International Money Transfer Operators, linked to FX market reforms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                    <Globe2 className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Transparent FX Rates and Settlement</p>
                    <p className="text-sm text-muted-foreground">
                      Clear, market-driven exchange rates with transparent settlement processes for all remittance transactions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Enhanced Security and Compliance</p>
                    <p className="text-sm text-muted-foreground">
                      Rigorous KYC/AML standards ensuring your funds are protected and transactions are fully compliant.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <p className="font-medium mb-2">NDIG Advantage:</p>
                <p className="text-sm text-muted-foreground">
                  When you invest through NDIG, your funds flow through these regulated channels directly into your NRNIA account — full transparency, full security, zero intermediaries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Protection Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Investment Protection & Repatriation Rights
              </h2>
              <p className="text-xl text-muted-foreground">
                Your Investments Are Protected by Law
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-5/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-chart-5" />
                  </div>
                  <h3 className="font-bold mb-2">NIPC Act</h3>
                  <p className="text-sm text-muted-foreground">
                    100% foreign ownership allowed, full repatriation rights guaranteed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-5/20 flex items-center justify-center mb-4">
                    <FileCheck className="w-6 h-6 text-chart-5" />
                  </div>
                  <h3 className="font-bold mb-2">CBN FX Manual</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear rules for capital and profit repatriation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-5/20 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-chart-5" />
                  </div>
                  <h3 className="font-bold mb-2">NRNIA Framework</h3>
                  <p className="text-sm text-muted-foreground">
                    Explicit provisions for investment repatriation
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-chart-5">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold mb-6">
                  How Repatriation Works
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-chart-5/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-chart-5">1</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Your NDIG investments are held in your NRNIA account</p>
                      <p className="text-sm text-muted-foreground">
                        All investments on the NDIG platform are settled through your CBN-regulated NRNIA account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-chart-5/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-chart-5">2</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Exit proceeds return to your NRNIA</p>
                      <p className="text-sm text-muted-foreground">
                        When you exit an investment, proceeds are credited to your NRNIA account in FCY or Naira.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-chart-5/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-chart-5">3</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Repatriate funds to your foreign account</p>
                      <p className="text-sm text-muted-foreground">
                        You can transfer funds from your NRNIA to your foreign bank account at any time, with no restrictions on capital or profit repatriation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button variant="outline" className="gap-2">
                    View Full Legal Framework
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Banks Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Partner Banks Offering NRNIA Accounts
              </h2>
              <p className="text-xl text-muted-foreground">
                Open Your Investment Account Today
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                "Access Bank",
                "Zenith Bank",
                "GTBank",
                "First Bank",
                "UBA",
                "Stanbic IBTC",
                "Fidelity Bank",
                "Union Bank"
              ].map((bank) => (
                <Card key={bank} className="hover:border-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-sm">{bank}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold mb-6">
                  Account Opening Process
                </h3>

                <div className="grid md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Get Your NRBVN</p>
                    <p className="text-xs text-muted-foreground">If you don't have one</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Choose a Bank</p>
                    <p className="text-xs text-muted-foreground">From partners above</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Apply Online</p>
                    <p className="text-xs text-muted-foreground">Complete application</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Submit KYC</p>
                    <p className="text-xs text-muted-foreground">Documents online</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary">5</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Account Active</p>
                    <p className="text-xs text-muted-foreground">Within 48 hours</p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" className="gap-2">
                    Compare Banks & Open Account
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Investing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Open your NRNIA account today and access regulator-vetted investment opportunities through NDIG.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                Open NRNIA Account
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-white border-white hover:bg-white/10">
                Explore Investment Opportunities
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
