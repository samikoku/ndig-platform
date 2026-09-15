import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import MarketTicker from "./MarketTicker";
import ChatWidget from "./ChatWidget";
import { InterestRegistrationDialog } from "./InterestRegistrationDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Investment Nexus", path: "/investment-nexus" },
    { name: "Investor Protections", path: "/investor-protections" },
    { name: "Trust Centre", path: "/trust-centre" },
    { name: "Diaspora Readiness", path: "/diaspora-readiness" },
    { name: "Compliance", path: "/compliance-tracker" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 flex flex-col ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Market Ticker - Only visible when scrolled or on specific pages if needed,
            but for now we'll keep it always visible at the top of the header */}
        <div className="w-full bg-sidebar text-white">
           <MarketTicker />
        </div>
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/ndig-logo.png"
              alt="NDIG - Nigeria Diaspora Investment Gateway"
              className="h-14 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              loading="eager"
            />
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-2xl leading-none tracking-tight text-foreground mb-0.5 transition-colors duration-300 group-hover:text-primary">
                NDIG
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium leading-tight transition-colors duration-300 group-hover:text-foreground">
                Nigeria Diaspora
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium leading-tight transition-colors duration-300 group-hover:text-foreground">
                Investment Gateway
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/investment-nexus" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/investment-nexus" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Investment Nexus
            </Link>
            <Link href="/diaspora-bonds" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/diaspora-bonds" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Diaspora Bonds
            </Link>
            <Link href="/banking-options" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/banking-options" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Banking
            </Link>
            <Link href="/investment-index" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/investment-index" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Investment Index
            </Link>
            <Link href="/trust-centre" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/trust-centre" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Trust Centre
            </Link>
            <Link href="/diaspora-readiness" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/diaspora-readiness" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              Diaspora Readiness
            </Link>
            <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${location === "/dashboard" ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"}`}>
              My Portfolio
            </Link>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
              <Button
                onClick={() => setRegistrationDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6"
              >
                Register Interest
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-10">
                  <Link href="/investment-nexus" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/investment-nexus" ? "text-primary" : "text-muted-foreground"}`}>
                    Investment Nexus
                  </Link>
                  <Link href="/diaspora-bonds" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/diaspora-bonds" ? "text-primary" : "text-muted-foreground"}`}>
                    Diaspora Bonds
                  </Link>
                  <Link href="/banking-options" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/banking-options" ? "text-primary" : "text-muted-foreground"}`}>
                    Banking Options
                  </Link>
                  <Link href="/investment-index" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/investment-index" ? "text-primary" : "text-muted-foreground"}`}>
                    Investment Index
                  </Link>
                  <Link href="/trust-centre" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/trust-centre" ? "text-primary" : "text-muted-foreground"}`}>
                    Trust Centre
                  </Link>
                  <Link href="/diaspora-readiness" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/diaspora-readiness" ? "text-primary" : "text-muted-foreground"}`}>
                    Diaspora Readiness
                  </Link>
                  <Link href="/dashboard" className={`text-lg font-medium transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
                    My Portfolio
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <Link href="/login" className="text-lg font-medium text-muted-foreground hover:text-foreground">
                    Log In
                  </Link>
                  <Button
                    onClick={() => setRegistrationDialogOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Register Interest
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[6.5rem] md:pt-[7.5rem]">{children}</main>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Interest Registration Dialog */}
      <InterestRegistrationDialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
      />

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/ndig-logo.png" alt="NDIG Logo" className="w-8 h-8" />
                <span className="font-serif font-bold text-xl tracking-tight">
                  NDIG
                </span>
              </div>
              <p className="text-sm text-chart-1 font-medium italic mb-2">
                Bridging Diaspora Wealth to National Growth
              </p>
              <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
                The regulator-vetted information platform connecting the Nigerian
                diaspora with productive investment opportunities.
              </p>
              <div className="pt-4 flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-6 text-primary">
                Platform
              </h3>
              <ul className="space-y-3 text-sm text-sidebar-foreground/80">
                <li>
                  <Link href="/investment-nexus" className="hover:text-primary transition-colors">
                    Investment Nexus
                  </Link>
                </li>
                <li>
                  <Link href="/policy-interface" className="hover:text-primary transition-colors">
                    Policy Interface
                  </Link>
                </li>
                <li>
                  <Link href="/productivity-network" className="hover:text-primary transition-colors">
                    Productivity Network
                  </Link>
                </li>
                <li>
                  <Link href="/trust-centre" className="hover:text-primary transition-colors">
                    Trust Centre
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-6 text-primary">
                Resources
              </h3>
              <ul className="space-y-3 text-sm text-sidebar-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Concept Note
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    NPA 2025-2035
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Diaspora Report
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-6 text-primary">
                Strategic Partners
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="https://www.nidcom.gov.ng/" target="_blank" rel="noopener noreferrer" className="h-8 bg-sidebar-accent/50 rounded flex items-center justify-center text-xs font-bold text-sidebar-foreground/50 hover:bg-primary hover:text-white transition-colors">
                  NiDCOM
                </a>
                <a href="https://www.nipc.gov.ng/" target="_blank" rel="noopener noreferrer" className="h-8 bg-sidebar-accent/50 rounded flex items-center justify-center text-xs font-bold text-sidebar-foreground/50 hover:bg-primary hover:text-white transition-colors">
                  NIPC
                </a>
                <a href="https://www.cbn.gov.ng/" target="_blank" rel="noopener noreferrer" className="h-8 bg-sidebar-accent/50 rounded flex items-center justify-center text-xs font-bold text-sidebar-foreground/50 hover:bg-primary hover:text-white transition-colors">
                  CBN
                </a>
                <a href="https://sec.gov.ng/" target="_blank" rel="noopener noreferrer" className="h-8 bg-sidebar-accent/50 rounded flex items-center justify-center text-xs font-bold text-sidebar-foreground/50 hover:bg-primary hover:text-white transition-colors">
                  SEC
                </a>
              </div>
            </div>

            {/* HomeFund NG */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-6 text-primary">
                HomeFund NG
              </h3>
              <p className="text-sm text-sidebar-foreground/80 leading-relaxed">
                Housing Gateway — Connecting diaspora investment to Nigeria's housing development initiatives
              </p>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-12 pt-8">
            <p className="text-xs text-sidebar-foreground/70 mb-4">
              NDIG does not provide investment advice, and does not collect or hold investor funds. All investments are made directly with the licensed institutions named.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-sidebar-foreground/50">
              <p>
                © 2026 NDIG - Nigeria Diaspora Investment Gateway. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
