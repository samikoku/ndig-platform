import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    name: "General",
    items: [
      {
        question: "What is NDIG?",
        answer:
          "NDIG (Nigeria Diaspora Investment Gateway) is a private-sector information, verification and distribution infrastructure. We connect the Nigerian diaspora to regulator-vetted investment opportunities - diaspora bonds, NRNIA accounts, and vetted projects - by informing, verifying, and directly connecting investors to licensed institutions. NDIG is founded and operated by NAKACHI Consulting.",
      },
      {
        question: "Is NDIG a government agency?",
        answer:
          "No. NDIG is a private-sector platform, not a government agency. We are regulator-vetted, meaning every institution and product listed on NDIG has been screened against the relevant Nigerian regulator (CBN, SEC, NIPC, NiDCOM) before appearing on the platform. NDIG itself is not government-backed or government-endorsed.",
      },
      {
        question: "Does NDIG hold my money?",
        answer:
          "No, never. NDIG does not provide investment advice, and does not collect or hold investor funds. NDIG is a referral and information platform - every investment is made directly between you and the licensed institution named (DMO for bonds, banks for NRNIA accounts, NIPC for projects). Your money never passes through NDIG.",
      },
      {
        question: "What is the Sovereign Brief?",
        answer:
          "The Sovereign Brief is NDIG's periodic briefing on Nigeria's diaspora investment infrastructure, policy, and opportunity - plain-language intelligence for diaspora investors, published as dated editions. You can read current and past editions at /sovereign-brief.",
      },
    ],
  },
  {
    name: "Registration",
    items: [
      {
        question: "How do I register?",
        answer:
          "Click \"Register Interest\" anywhere on the site and complete the short form (name, email, location, and investment capacity). Registering does not commit you to anything and does not involve any payment - it simply connects you with verified opportunities and generates your unique referral code.",
      },
      {
        question: "What is a referral code?",
        answer:
          "When you register your interest, NDIG generates a unique referral code (in the format NDIG-XXXXXXXX) for you. You quote this code when you pay directly to a licensed institution - DMO for diaspora bonds, a bank for an NRNIA account, or NIPC for a project - so your investment is correctly tracked back to your registration. NDIG never collects payment through the referral code; it is a tracking reference only.",
      },
      {
        question: "How do I unsubscribe from emails?",
        answer:
          "Every NDIG email includes an unsubscribe link at the bottom. You can also email ndig@nakachiconsulting.com.ng from the address you registered with and we will remove you from all communications within a reasonable time. See our Privacy Policy for full details on how we handle your data.",
      },
    ],
  },
  {
    name: "Investments",
    items: [
      {
        question: "What is HomeFund NG?",
        answer:
          "HomeFund NG is an independent diaspora housing initiative. NDIG provides a direct link to HomeFund NG's own platform and does not process housing applications, payments, or approvals on its behalf. Visit /homefund for details.",
      },
    ],
  },
  {
    name: "Security",
    items: [
      {
        question: "What happens if I have a complaint?",
        answer:
          "Every advocacy request raised through the Trust Centre receives an initial response within 48 hours, with a target of full resolution within 15 working days. If a partner institution breaches this SLA three times within 12 months, it is publicly delisted from NDIG. Quote your Partner Assurance Code when contacting the Trust Centre about any listed partner.",
      },
    ],
  },
  {
    name: "Partners",
    items: [
      {
        question: "How are institutions verified?",
        answer:
          "Every institution listed on NDIG passes a nine-point verification gate - covering regulatory registration, licensing, corporate transparency, financial health, track record, complaint history, data security, dispute resolution, and ongoing monitoring - before appearing on the platform, and is reviewed on an ongoing basis afterward. See /verification-standard for the full standard.",
      },
      {
        question: "What is the nine-point vetting gate?",
        answer:
          "It's the standard every partner institution must pass before being listed: confirmed regulatory registration, valid licensing, verifiable corporate ownership, financial health review, track record audit, complaint history check, data security assessment, a documented dispute resolution mechanism, and ongoing monitoring for as long as the partner remains listed. NDIG does not guarantee the products or performance of any partner - verification confirms a partner meets NDIG's listing standard at the time of review, not investment advice.",
      },
      {
        question: "How do I become a Country Anchor?",
        answer:
          "Country Anchors are trusted, introducer-only representatives of NDIG in their country of residence - they inform, introduce, verify, support, represent, and report, but never advise on investments or handle funds. Apply through /country-anchors. Applications go through screening, a group orientation call, a compliance briefing and covenant, and onboarding. Wave one is open to the US, UK, Canada, UAE, South Africa, Germany, Ireland, and Saudi Arabia.",
      },
    ],
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm md:text-base">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">FAQs</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Straight answers about how NDIG works, what we do, and what we never do.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {categories.map((category) => (
              <div key={category.name}>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">{category.name}</h2>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <FAQAccordionItem key={item.question} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container px-4 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-1">
            Contact NDIG's Trust Centre or email us directly.
          </p>
          <a href="mailto:ndig@nakachiconsulting.com.ng" className="text-primary font-medium hover:underline">
            ndig@nakachiconsulting.com.ng
          </a>
        </div>
      </section>
    </div>
  );
}
