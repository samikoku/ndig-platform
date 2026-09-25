import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, FileCheck, Lock, Upload, Search, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function TrustCentre() {
  const [step, setStep] = useState(1);
  const [cacQuery, setCacQuery] = useState("");
  const [cacResult, setCacResult] = useState<"idle" | "checked">("idle");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white py-16">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <img src="/ndig-logo.png" alt="NDIG Logo" className="w-16 h-16 mx-auto mb-6 rounded-full bg-white p-1.5 object-contain" />
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Trust & Verification Centre
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Your gateway to secure, regulator-vetted investing. Complete your KYC to unlock full platform access.
          </p>
        </div>
      </div>

      <div className="container px-4 -mt-12">
        <Card className="max-w-4xl mx-auto border-border shadow-xl">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Identity Verification</CardTitle>
              <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    Please provide your official details as they appear on your passport.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="e.g. Oluwaseun" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="e.g. Adebayo" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} size="lg" className="w-full md:w-auto">
                    Continue to Documents
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Document Upload</h3>
                  <p className="text-muted-foreground">
                    Securely upload your government-issued ID for verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">International Passport</h4>
                    <p className="text-xs text-muted-foreground">
                      Upload the data page of your valid Nigerian or Foreign passport.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Proof of Address</h4>
                    <p className="text-xs text-muted-foreground">
                      Utility bill or bank statement dated within the last 3 months.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} size="lg">Submit for Review</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-chart-5/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-chart-5" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Submission Received</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Your documents have been securely transmitted to our compliance team. Verification typically takes 24-48 hours. You will be notified via email.
                </p>
                <Button onClick={() => setStep(1)} variant="outline">
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold">Bank-Grade Encryption</h4>
            <p className="text-sm text-muted-foreground">
              All data is encrypted at rest and in transit using AES-256 standards.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
              <FileCheck className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold">GDPR & NDPR Compliant</h4>
            <p className="text-sm text-muted-foreground">
              Fully compliant with Nigerian and International data protection regulations.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
              <img src="/ndig-logo.png" alt="NDIG Logo" className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Standards-Based Verification</h4>
            <p className="text-sm text-muted-foreground">
              Identity verification aligned with NIMC-recognized standards.
            </p>
          </div>
        </div>

        {/* Referral Platform Model Explanation */}
        <div className="max-w-5xl mx-auto mt-20">
          <Card className="bg-gradient-to-br from-chart-1/5 to-chart-5/5 border-2 border-chart-1/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-chart-1/20 flex items-center justify-center">
                    <img src="/ndig-logo.png" alt="NDIG Logo" className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold mb-4">
                    How NDIG Protects Your Investment
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    NDIG operates as a <strong>referral and information platform</strong>, not a payment processor. This means:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">We Never Hold Your Funds</h4>
                        <p className="text-xs text-muted-foreground">
                          You pay directly to regulated institutions (DMO, banks, NIPC) using your unique referral code
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Maximum Security</h4>
                        <p className="text-xs text-muted-foreground">
                          Your funds go directly to CBN-regulated institutions, never through intermediaries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Full Transparency</h4>
                        <p className="text-xs text-muted-foreground">
                          All transactions are between you and licensed institutions, fully traceable
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">No Licensing Complexity</h4>
                        <p className="text-xs text-muted-foreground">
                          We're not a payment service provider, reducing regulatory risk and operational overhead
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-chart-1/20">
                    <p className="text-sm font-medium mb-2">How It Works:</p>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li>1. You browse investment opportunities on NDIG and register interest</li>
                      <li>2. You receive a unique referral code (e.g., NDIG-ABC123)</li>
                      <li>3. You pay directly to the investment vehicle (DMO for bonds, bank for NRNIA)</li>
                      <li>4. The investment vehicle confirms your investment and pays NDIG a referral fee</li>
                      <li>5. You track your investments and access advisory services through NDIG</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Who Operates NDIG Section */}
        <div className="max-w-5xl mx-auto mt-20">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                    <img src="/ndig-logo.png" alt="NDIG Logo" className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold mb-4">
                    Who Operates NDIG?
                  </h3>

                  {/* Dr. Sam Ikoku Photo and Bio */}
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src="/images/dr-sam-ikoku.jpg"
                        alt="Dr. Sam Ikoku, Managing Consultant, NAKACHI Consulting"
                        className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-lg border-2 border-primary/20"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">Dr. Sam Ikoku</h4>
                      <p className="text-sm text-primary font-medium mb-2">Managing Consultant, NAKACHI Consulting</p>
                      <p className="text-xs text-muted-foreground">
                        40+ years consulting to Nigerian government agencies including NIPC, NCP, SEC, BPSR, FERMA, NESREA, NEPZA, NACA, NAMA, FAAN, National Planning Commission, Vision 2020, and Nigeria Project 2050. Deep expertise in diaspora engagement, productivity consulting, and public-private partnerships.
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    NDIG is operated by <strong>NAKACHI Consulting</strong>, an established Nigerian consulting firm specializing in diaspora engagement and economic development.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Established Consulting Firm</h4>
                        <p className="text-xs text-muted-foreground">
                          Not a startup—NAKACHI Consulting has decades of experience in government partnerships and productivity consulting
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Extensive Government Credentials</h4>
                        <p className="text-xs text-muted-foreground">
                          Led by Dr. Sam Ikoku with 40+ years consulting to Nigerian government agencies: NIPC, NCP, SEC, BPSR, FERMA, NESREA, NEPZA, NACA, NAMA, FAAN, National Planning Commission, Vision 2020, Nigeria Project 2050
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Independent Platform</h4>
                        <p className="text-xs text-muted-foreground">
                          NDIG is an independent referral and information platform connecting diaspora investors to regulated institutions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Institutional Alignment</h4>
                        <p className="text-xs text-muted-foreground">
                          Operates in alignment with the regulatory frameworks of NiDCOM, DMO, CBN, NIPC, and SEC
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-2">Why This Matters:</p>
                    <p className="text-sm text-muted-foreground">
                      NAKACHI Consulting's established track record and government relationships ensure NDIG operates with institutional credibility, not as an unproven tech startup. All partnership agreements are signed by NAKACHI Consulting, with NDIG as the branded service platform.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CBN Diaspora Infrastructure Section */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              CBN's Revolutionary Diaspora Infrastructure (2024-2025)
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nigeria has built unprecedented financial infrastructure specifically for diaspora investors. Your country is ready for your capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-chart-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-chart-1" />
                  NRNIA Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-bold text-foreground">Launched: January 2025</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Non-Resident Nigerian Investment Accounts (NRNIA) allow diaspora to invest in Nigerian assets with full repatriation rights.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Participate in diaspora bonds</li>
                  <li>• Invest in stocks, real estate, treasury bills</li>
                  <li>• Repatriate capital and returns anytime</li>
                  <li>• No prior approval needed</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-chart-2" />
                  Non-Resident BVN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-bold text-foreground">Launched: May 2025</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get your Bank Verification Number (BVN) without traveling to Nigeria. Open accounts remotely from anywhere in the world.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Fully digital enrollment</li>
                  <li>• Biometric verification via app</li>
                  <li>• Issued within 48 hours</li>
                  <li>• Valid for all Nigerian banks</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-chart-3" />
                  IMTO Reforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-bold text-foreground">Implemented: 2024</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  International Money Transfer Operator reforms have doubled formal remittance flows and reduced transaction costs.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• $20.9B remittances in 2024</li>
                  <li>• Formal channels: $4.73B (up from $3.3B)</li>
                  <li>• Lower fees, faster transfers</li>
                  <li>• More licensed operators</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-chart-1/5 border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                    <img src="/cbn-logo.jpg" alt="CBN Logo" className="w-12 h-12 object-contain" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold mb-4">
                    Official CBN Framework: Diaspora Bonds Explicitly Supported
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The Central Bank of Nigeria's NRNIA framework (January 2025) explicitly states:
                  </p>
                  <div className="p-4 bg-background rounded-lg border border-primary/20 mb-4">
                    <p className="text-sm italic">
                      "Non-Resident Nigerians can use their NRNIA to participate in Nigeria's Diaspora Bond and other debt instruments issued by the Federal Government, State Governments, or corporate entities."
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This regulatory clarity, combined with Nigeria's proven track record (2 diaspora bonds: $300M in 2017 fully redeemed, $900M in 2024 outstanding), is what NDIG helps diaspora investors navigate. Only DMO can issue sovereign diaspora bonds on behalf of FGN; NDIG is an independent referral platform, not an official DMO channel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <Link href="/banking-options">
              <Button size="lg" className="gap-2">
              Learn More About Banking Options
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>

          {/* CAC Lookup */}
          <Card className="mt-16 border-2">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Look Up a Company on CAC</h3>
                  <p className="text-muted-foreground">
                    Check whether an institution is registered with Nigeria's Corporate Affairs
                    Commission before you invest.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCacResult("checked");
                }}
                className="flex flex-col sm:flex-row gap-3 mb-4"
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor="cacQuery" className="sr-only">Company name or RC number</Label>
                  <Input
                    id="cacQuery"
                    placeholder="Company name or RC number"
                    value={cacQuery}
                    onChange={(e) => setCacQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={cacQuery.trim().length < 2}>
                  Check on CAC
                </Button>
              </form>

              {cacResult === "checked" && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <FileCheck className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    NDIG does not run its own copy of the CAC register. Continue your search for{" "}
                    <strong>"{cacQuery}"</strong> on the official CAC public search portal to see
                    live registration status.{" "}
                    <a
                      href="https://search.cac.gov.ng"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Open CAC Public Search
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Tracker link */}
          <Card className="mt-8 border-2 bg-muted/30">
            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Compliance Tracker</h3>
                  <p className="text-sm text-muted-foreground">
                    See NDIG's alignment with SEC, CBN, NIPC, and NiDCOM frameworks in detail.
                  </p>
                </div>
              </div>
              <Link href="/compliance-tracker">
                <Button variant="outline" className="gap-2 whitespace-nowrap">
                  View Compliance Tracker
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
