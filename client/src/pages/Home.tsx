import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Building2, Globe2, ShieldCheck, Users, PlayCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import SuccessStories from "@/components/SuccessStories";
import { useDemoMode } from "@/contexts/DemoModeContext";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { enterDemoMode } = useDemoMode();
  const [, setLocation] = useLocation();

  const handleTryDemo = () => {
    enterDemoMode();
    setLocation("/dashboard");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-sidebar pt-20 md:pt-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.jpg"
            alt="Futuristic Lagos Skyline"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 px-4 py-12 md:py-20">
          <div className="max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-gold tracking-wide uppercase">
                Regulator-Vetted Investment Platform
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-white mb-4 md:mb-6">
              Invest in Nigeria's Future with <span className="text-gold">Regulator-Vetted Instruments</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mt-4 md:mt-6 mb-6 md:mb-8">
              Government-guaranteed fixed income. Full repatriation rights. Built on CBN's revolutionary 2025 infrastructure—NRNIA accounts, NRBVN system, and seamless diaspora banking. Your country is ready for your capital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/get-nrbvn">
                <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-sidebar text-base md:text-lg px-8 py-6 h-auto rounded-full shadow-lg shadow-gold/25 transition-all hover:scale-105">
                  Get Your NRBVN (Free)
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/diaspora-bonds">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-base md:text-lg px-8 py-6 h-auto rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105">
                  View Diaspora Bonds
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                onClick={handleTryDemo}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-base md:text-lg px-8 py-6 h-auto rounded-full backdrop-blur-sm"
              >
                <PlayCircle className="mr-2 w-5 h-5" />
                Try Demo
              </Button>
            </div>

            <div className="pt-8 md:pt-12 space-y-6 md:space-y-8">
              <p className="text-base md:text-lg text-gray-300 italic font-light leading-relaxed max-w-2xl">
                <span className="text-gold font-semibold">$21B annual diaspora inflow</span> — at least 3x channelable into productive investment once a trust layer exists.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 border-t border-white/10 pt-8 md:pt-12">
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                <p className="text-2xl md:text-3xl font-bold text-white font-serif">$20.9B</p>
                <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mt-0 sm:mt-1">2024 Remittances</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                <p className="text-2xl md:text-3xl font-bold text-white font-serif">$73.2B</p>
                <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mt-0 sm:mt-1">Investment Potential</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                <p className="text-2xl md:text-3xl font-bold text-white font-serif">100%</p>
                <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mt-0 sm:mt-1">Regulator-Vetted</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Referral Platform Model */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                How NDIG Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We connect you to regulator-vetted investment opportunities. You invest directly with official partners. We never hold your funds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chart-1">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Browse Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Explore vetted diaspora bonds, NRNIA accounts, and investment projects
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chart-2">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Get Your Referral Code</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a unique tracking code when you register interest
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chart-3">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Invest Directly</h3>
                <p className="text-sm text-muted-foreground">
                  Pay directly to DMO, banks, or NIPC using your referral code
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-5/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chart-5">4</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Track & Grow</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your investments and access exclusive advisory services
                </p>
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-chart-1" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Your Money, Your Control</h3>
                  <p className="text-muted-foreground">
                    NDIG is a <strong>referral and information platform</strong>, not a payment processor. We never collect or hold your investment funds. You pay directly to regulated institutions (DMO for bonds, banks for NRNIA accounts, NIPC for projects). This means:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1 mt-1">✓</span>
                      <span><strong>Maximum security:</strong> Your funds go directly to CBN-regulated institutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1 mt-1">✓</span>
                      <span><strong>No licensing complexity:</strong> We're not a payment service provider</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chart-1 mt-1">✓</span>
                      <span><strong>Full transparency:</strong> All transactions are between you and licensed institutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background border-y border-border">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              NDIG connects Nigeria's diaspora to regulator-vetted investment opportunities that build the nation while securing financial futures. We educate and guide diaspora investors to official channels—diaspora bonds, NRNIA accounts, and vetted projects—ensuring transparency, security, and full repatriation rights. Every investment we facilitate strengthens Nigeria's infrastructure and brings our people closer to home.
            </p>
          </div>
        </div>
      </section>

      {/* NDIG Operational Advantages */}
      <section className="py-16 md:py-20 bg-sidebar text-white">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Why NDIG Outperforms Government Websites
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Beyond aggregating official information, NDIG delivers real-time intelligence and always-on support that government portals cannot match.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-sidebar-accent border-gold/20 hover:border-gold/40 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white">24-Hour Information Updates</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Government websites update sporadically. NDIG monitors DMO, CBN, NIPC, and NiDCOM daily, delivering bond announcements, rate changes, and policy updates within 24 hours—so you never miss an opportunity.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-sidebar-accent border-sidebar-foreground/20 hover:border-sidebar-foreground/40 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-xl bg-sidebar-foreground/10 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white">Scalable Capacity</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Government portals crash during high-traffic bond offerings. NDIG's cloud infrastructure scales instantly to serve 350,000+ diaspora simultaneously—no downtime, no missed subscriptions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-sidebar-accent border-gold/20 hover:border-gold/40 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white">AI-Powered Customer Support</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    No waiting for email responses. NDIG's AI assistant answers bond eligibility, NRNIA requirements, and tax questions instantly—24/7 across all time zones where diaspora live.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-300 mb-6">
                <strong className="text-white">Result:</strong> Faster decisions, zero missed opportunities, and confidence that you're always working with the latest official information.
              </p>
              <Link href="/investment-nexus">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-sidebar">
                  Explore Investment Opportunities
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CBN Infrastructure Highlight Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-chart-1/5 via-primary/5 to-chart-2/5">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-1/10 border border-chart-1/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
                <span className="text-sm font-medium text-chart-1 tracking-wide uppercase">
                  New: CBN 2025 Infrastructure
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Nigeria Is Ready for Your Capital
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The Central Bank has built unprecedented diaspora investment infrastructure. NDIG connects 350,000+ diaspora Nigerians (from 20M total) to these regulator-vetted opportunities. Your country is open for business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-chart-1/20 hover:border-chart-1/40 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-chart-1" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">NRNIA Accounts</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Invest in diaspora bonds, stocks, real estate with full repatriation rights. Launched January 2025.
                  </p>
                  <Link href="/banking-options" className="text-sm font-medium text-chart-1 hover:underline flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-chart-2/20 hover:border-chart-2/40 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/20 flex items-center justify-center mb-4">
                    <Globe2 className="w-6 h-6 text-chart-2" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Non-Resident BVN</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get your Bank Verification Number without traveling to Nigeria. Fully digital enrollment.
                  </p>
                  <Link href="/banking-options" className="text-sm font-medium text-chart-2 hover:underline flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Diaspora Bonds</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Government-guaranteed fixed income. Nigeria's proven track record: $1.2B raised across 2 issuances (2017: $300M redeemed, 2024: $900M outstanding).
                  </p>
                  <Link href="/diaspora-bonds" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    Register Interest <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/diaspora-bonds">
                <Button size="lg" className="gap-2">
                  Explore Diaspora Bonds
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
              A Comprehensive Ecosystem
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              NDIG integrates four powerful modules to ensure your investments are safe, productive, and impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Module 1: Investment Nexus */}
            <Link href="/investment-nexus" className="group relative overflow-hidden rounded-2xl flex flex-col md:block bg-card md:bg-transparent shadow-sm md:shadow-none border md:border-none border-border">
                {/* Mobile: Image on top, Text below. Desktop: Image background with overlay */}
                <div className="relative h-48 md:h-auto md:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/images/investment-nexus.jpg"
                    alt="Investment Nexus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="p-6 md:absolute md:bottom-0 md:left-0 md:p-12 w-full bg-card md:bg-transparent">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-chart-1/20 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-chart-1/30">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-chart-1" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground md:text-white mb-2 md:mb-3 group-hover:text-chart-1 transition-colors">
                    Investment Nexus
                  </h3>
                  <p className="text-muted-foreground md:text-gray-300 max-w-md mb-4 md:mb-6 md:opacity-0 md:transform md:translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    Access vetted opportunities in Real Estate, Stock Market, and Collective Investment Schemes.
                  </p>
                  <div className="flex items-center text-chart-1 font-medium text-sm uppercase tracking-widest">
                    Explore Nexus <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
            </Link>

            {/* Module 2: Policy Interface */}
            <Link href="/policy-interface" className="group relative overflow-hidden rounded-2xl flex flex-col md:block bg-card md:bg-transparent shadow-sm md:shadow-none border md:border-none border-border">
                <div className="relative h-48 md:h-auto md:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/images/policy-interface.jpg"
                    alt="Policy Interface"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                <div className="p-6 md:absolute md:bottom-0 md:left-0 md:p-12 w-full bg-card md:bg-transparent">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-chart-2/20 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-chart-2/30">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-chart-2" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground md:text-white mb-2 md:mb-3 group-hover:text-chart-2 transition-colors">
                    Policy & Governance
                  </h3>
                  <p className="text-muted-foreground md:text-gray-300 max-w-md mb-4 md:mb-6 md:opacity-0 md:transform md:translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    Directly participate in legislative discussions and shape the policies that affect your investments.
                  </p>
                  <div className="flex items-center text-chart-2 font-medium text-sm uppercase tracking-widest">
                    Shape Policy <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
            </Link>

            {/* Module 3: Productivity Network */}
            <Link href="/productivity-network" className="group relative overflow-hidden rounded-2xl flex flex-col md:block bg-card md:bg-transparent shadow-sm md:shadow-none border md:border-none border-border">
                <div className="relative h-48 md:h-auto md:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/images/productivity-network.jpg"
                    alt="Productivity Network"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                <div className="p-6 md:absolute md:bottom-0 md:left-0 md:p-12 w-full bg-card md:bg-transparent">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-chart-3/20 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-chart-3/30">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-chart-3" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground md:text-white mb-2 md:mb-3 group-hover:text-chart-3 transition-colors">
                    Productivity Network
                  </h3>
                  <p className="text-muted-foreground md:text-gray-300 max-w-md mb-4 md:mb-6 md:opacity-0 md:transform md:translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    Connect with fellow professionals, mentor entrepreneurs, and advertise your services.
                  </p>
                  <div className="flex items-center text-chart-3 font-medium text-sm uppercase tracking-widest">
                    Join Network <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
            </Link>

            {/* Module 4: Trust Centre */}
            <Link href="/trust-centre" className="group relative overflow-hidden rounded-2xl flex flex-col md:block bg-card md:bg-transparent shadow-sm md:shadow-none border md:border-none border-border">
                <div className="relative h-48 md:h-auto md:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="/images/trust-centre.jpg"
                    alt="Trust Centre"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                <div className="p-6 md:absolute md:bottom-0 md:left-0 md:p-12 w-full bg-card md:bg-transparent">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-chart-5/20 backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 border border-chart-5/30">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-chart-5" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground md:text-white mb-2 md:mb-3 group-hover:text-chart-5 transition-colors">
                    Trust & Transparency
                  </h3>
                  <p className="text-muted-foreground md:text-gray-300 max-w-md mb-4 md:mb-6 md:opacity-0 md:transform md:translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    Verify investments, access legal resources, and ensure full regulatory compliance.
                  </p>
                  <div className="flex items-center text-chart-5 font-medium text-sm uppercase tracking-widest">
                    Verify Trust <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Value Proposition Section */}
      <section className="py-16 md:py-24 bg-sidebar text-sidebar-foreground">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
                Why Invest Through <span className="text-gold">NDIG</span>?
              </h2>
              <p className="text-base md:text-lg text-sidebar-foreground/80 leading-relaxed">
                Traditional remittance channels are often informal and consumption-driven. NDIG provides a structured, secure pathway to build generational wealth while contributing to national development.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Regulator-Vetted & Secured</h3>
                    <p className="text-sm md:text-base text-sidebar-foreground/70">Vetted against NPA, NiDCOM, NIPC, CBN, and SEC frameworks. Your investments are protected by clear regulatory frameworks.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-sidebar-foreground/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-sidebar-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">High-Yield Opportunities</h3>
                    <p className="text-sm md:text-base text-sidebar-foreground/70">Access exclusive real estate projects, privatization offers, and diaspora bonds not available on the open market.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Globe2 className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Seamless Digital Experience</h3>
                    <p className="text-sm md:text-base text-sidebar-foreground/70">Invest, monitor, and manage your portfolio from anywhere in the world through our secure digital platform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-3xl blur-2xl" />
              <Card className="relative bg-card/5 border-white/10 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="font-serif text-lg md:text-xl font-bold">Featured Opportunity</h3>
                      <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase">Open Now</span>
                    </div>

                    <div className="aspect-video rounded-lg bg-black/20 overflow-hidden relative">
                       {/* Placeholder for a specific project image */}
                       <div className="absolute inset-0 flex items-center justify-center text-white/20 font-serif text-2xl md:text-4xl font-bold text-center px-4">
                         Eko Atlantic Phase 4
                       </div>
                    </div>

                    <div>
                      <h4 className="text-xl md:text-2xl font-bold mb-2">Eko Atlantic Diaspora Tower</h4>
                      <p className="text-sm md:text-base text-sidebar-foreground/70 mb-4">Premium mixed-use development exclusively for diaspora investors. Guaranteed rental yields and capital appreciation.</p>

                      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                        <div className="text-center p-2 md:p-3 rounded bg-white/5">
                          <p className="text-[10px] md:text-xs text-sidebar-foreground/50 uppercase">Target Yield</p>
                          <p className="text-sm md:text-lg font-bold text-gold">12-15%</p>
                        </div>
                        <div className="text-center p-2 md:p-3 rounded bg-white/5">
                          <p className="text-[10px] md:text-xs text-sidebar-foreground/50 uppercase">Min Entry</p>
                          <p className="text-sm md:text-lg font-bold text-white">$25k</p>
                        </div>
                        <div className="text-center p-2 md:p-3 rounded bg-white/5">
                          <p className="text-[10px] md:text-xs text-sidebar-foreground/50 uppercase">Term</p>
                          <p className="text-sm md:text-lg font-bold text-white">5 Years</p>
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="bg-gradient-to-br from-primary to-sidebar rounded-3xl p-8 md:p-20 text-center relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#grid)" />
               </svg>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                Ready to Shape Nigeria's Future?
              </h2>
              <p className="text-lg md:text-xl text-white/80 font-light">
                Join thousands of professional Nigerians in the diaspora who are already registering their interest. Be part of the movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 text-lg px-10 py-6 h-auto rounded-full shadow-xl">
                  Register Now
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto rounded-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
