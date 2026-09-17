import { Calendar } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <img src="/ndig-logo.png" alt="NDIG Logo" className="w-16 h-16 mx-auto rounded-full bg-white p-1.5 object-contain" />
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              About NDIG
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-gold">
              Build Nigeria from where you stand.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every year, Nigeria's diaspora sends billions of dollars home - money that overwhelmingly
              flows into consumption rather than productive investment. NDIG (Nigeria Diaspora
              Investment Gateway) exists to change that: a single, regulator-vetted front door
              connecting the diaspora to Nigeria's diaspora bonds, NRNIA accounts, and vetted
              investment opportunities, without ever standing between an investor and their money.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              NDIG is a referral and information platform, not a payment processor. It never holds
              investor funds - every transaction happens directly between a diaspora investor and a
              licensed institution. NDIG's role is to make that path easier to find, easier to trust,
              and easier to act on.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              NDIG is founded and operated by <strong>NAKACHI Consulting</strong>, an established
              Nigerian consulting firm with decades of experience in diaspora engagement, productivity
              consulting, and public-private partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Chairman's note */}
      <section className="py-16 md:py-24 bg-sidebar text-sidebar-foreground">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">A Note from the Chairman</h2>
            <div className="bg-sidebar-accent rounded-2xl p-8 md:p-12">
              <blockquote className="text-lg md:text-xl font-light leading-relaxed mb-6">
                "For too long, the Nigerian diaspora has sent money home without a trusted way to turn
                it into lasting wealth - for their families and for the nation. NDIG is our answer: a
                platform built on verification, not promises, that connects you directly to
                regulator-vetted opportunities and lets you build Nigeria from wherever you stand in
                the world."
              </blockquote>
              <div>
                <p className="font-bold text-lg">Dr. Sam Ikoku</p>
                <p className="text-sm text-sidebar-foreground/70">Chairman, NAKACHI Consulting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Launch date */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/20">
            <Calendar className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Platform Launch</p>
              <p className="font-serif text-xl font-bold">1 October 2026</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
