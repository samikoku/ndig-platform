/**
 * NDIG site copy — single source of truth for public strings.
 *
 * Rules: see COPY-DOCTRINE.md at the repo root. Every change here must pass
 * `npm run doctrine:check`. No marketing copy lives inline in components.
 *
 * Every figure carries its source. Instrument dates and figures come only from
 * INSTRUMENT_LEDGER below; anything not on the ledger does not appear on the site.
 */

/* ------------------------------------------------------------------ */
/* Verified ledger                                                     */
/* ------------------------------------------------------------------ */

export const INSTRUMENT_LEDGER = {
  nrbvn: {
    name: "Non-Resident BVN",
    fact: "Launched May 2025",
    source: "CBN / NIBSS",
  },
  diasporaBond2017: {
    name: "2017 diaspora bond",
    fact: "$300M at 5.625%, redeemed in full in 2022",
    source: "DMO",
  },
  domesticDollarBond2024: {
    name: "2024 domestic dollar bond",
    fact: "$2bn programme; first issuance closed above $900m",
    source: "DMO",
  },
} as const;

/** Homepage stat strip. Each figure names its source. */
export interface HeroStat {
  value: string;
  label: string;
  source?: string;
}
export const HERO_STATS: HeroStat[] = [
  { value: "$20.98bn", label: "Diaspora Remittances, 2024", source: "CBN" },
  { value: "40", label: "Blocks in the 2026 Licensing Round", source: "NUPRC" },
  { value: "14", label: "Country Anchor Cities" },
];

/* ------------------------------------------------------------------ */
/* Core positioning (reused across pages)                              */
/* ------------------------------------------------------------------ */

export const POSITIONING = {
  /** Approved doctrine — locked. */
  intro:
    "NDIG is an independent, private-sector verification institution for the Nigerian diaspora. It checks institutions and opportunities against public regulatory records. It does not hold funds, sell products or give investment advice.",
  institutionNoun: "verification institution",
  moneyFlow:
    "Investments settle through licensed banks and custodians. NIPC and NDIG point the way; money never passes through either.",
  notPaymentProcessor:
    "NDIG is a verification institution, not a payment processor. We never collect or hold your investment funds.",
  referenceName: "Verification Reference",
};

/* ------------------------------------------------------------------ */
/* Homepage                                                             */
/* ------------------------------------------------------------------ */

export const HOME = {
  hero: {
    badge: "Regulator-Vetted Investment Platform",
    headline: "Invest in Nigeria's Future with Regulator-Vetted Instruments",
    intro: POSITIONING.intro,
    primaryCta: "Verify an Opportunity",
    secondaryCta: "Reach out to NDIG",
    secondaryCtaLabel: "Reach out to NDIG and we will give you what you need",
  },
  howItWorks: {
    heading: "How NDIG Works",
    intro:
      "NDIG checks institutions and opportunities against public regulatory records and tells you what it found. You invest directly through licensed institutions. NDIG never holds your funds.",
    steps: [
      {
        title: "Bring an Opportunity",
        body: "Send us an offer you have received, or look up an institution already on NDIG.",
      },
      {
        title: `Get Your ${POSITIONING.referenceName}`,
        body: "NDIG opens a numbered dossier and issues you a unique verification reference.",
      },
      {
        title: "Invest Through Licensed Channels",
        body: "Your money settles through licensed banks and custodians. NDIG and NIPC point the way; money never passes through either.",
      },
      {
        title: "Track Verification",
        body: "Track the verification status of the institutions you deal with.",
      },
    ],
  },
  moneyNote: {
    heading: "Your Money, Your Control",
    body: `${POSITIONING.notPaymentProcessor} ${POSITIONING.moneyFlow} This means:`,
    points: [
      { title: "Maximum security", body: "Your funds go only to licensed banks and custodians." },
      { title: "No licensing complexity", body: "We're not a payment service provider." },
      { title: "Full transparency", body: "All transactions are between you and licensed institutions." },
    ],
  },
  mission: {
    heading: "Our Mission",
    body:
      "NDIG is an independent verification institution for Nigeria's diaspora. We check institutions and opportunities against public regulatory records, publish what we find, and point you to the licensed channel. We never sell products, never hold funds and never give investment advice.",
  },
  scalableCapacity: {
    title: "Scalable Capacity",
    body:
      "Government portals can slow down during high-traffic bond offerings. NDIG's cloud infrastructure scales with demand, so you can still check what you need when it matters.",
  },
};

/* ------------------------------------------------------------------ */
/* Trust Centre                                                         */
/* ------------------------------------------------------------------ */

export const TRUST_CENTRE = {
  protects: {
    heading: "How NDIG Protects Your Investment",
    intro: `NDIG operates as a ${POSITIONING.institutionNoun}, not a payment processor. This means:`,
    points: [
      { title: "We Never Hold Your Funds", body: POSITIONING.moneyFlow },
      { title: "Maximum Security", body: "Your funds go only to licensed banks and custodians, never through NDIG." },
      { title: "Full Transparency", body: "All transactions are between you and licensed institutions, fully traceable." },
      { title: "No Licensing Complexity", body: "We're not a payment service provider, reducing regulatory risk and operational overhead." },
    ],
    stepsHeading: "How It Works:",
    steps: [
      "1. You bring an opportunity to NDIG, or look up an institution already verified",
      `2. NDIG issues a numbered ${POSITIONING.referenceName.toLowerCase()} (for example, NDIG-2026-948A1C)`,
      "3. NDIG checks the institution against public regulatory records and records the verdict in a dossier",
      "4. If you invest, your money settles through licensed banks and custodians, never through NDIG or NIPC",
      "5. NDIG takes no commission on your investment. It is funded by verification fees and Assurance membership",
    ],
  },
  independent: {
    title: "Independent Institution",
    body: "NDIG is an independent verification institution that checks institutions and opportunities against public regulatory records.",
  },
  infrastructure: {
    heading: "Diaspora Investment Infrastructure",
    intro: "The channels and instruments below are listed only with dates and figures NDIG has verified.",
    nrnia: {
      title: "NRNIA Accounts",
      body: "Non-Resident Nigerian Investment Accounts (NRNIA) allow diaspora to invest in Nigerian assets with repatriation rights.",
      points: ["Participate in diaspora bonds", "Invest in stocks, real estate, treasury bills", "Repatriation of capital and returns", "Opened through licensed banks"],
    },
    nrbvn: {
      title: INSTRUMENT_LEDGER.nrbvn.name,
      launched: `${INSTRUMENT_LEDGER.nrbvn.fact} (${INSTRUMENT_LEDGER.nrbvn.source})`,
      body: "Get your Bank Verification Number (BVN) without travelling to Nigeria. Open accounts remotely from anywhere in the world.",
      points: ["Fully digital enrollment", "Biometric verification via app", "Valid for all Nigerian banks"],
    },
    bonds: {
      title: "Diaspora and Dollar Bonds",
      points: [
        `${INSTRUMENT_LEDGER.diasporaBond2017.name}: ${INSTRUMENT_LEDGER.diasporaBond2017.fact}`,
        `${INSTRUMENT_LEDGER.domesticDollarBond2024.name}: ${INSTRUMENT_LEDGER.domesticDollarBond2024.fact}`,
      ],
    },
    dmoNote: {
      heading: "Who Issues Sovereign Bonds",
      body: `Only the DMO can issue sovereign bonds on behalf of the Federal Government. NDIG is an independent ${POSITIONING.institutionNoun}, not an official DMO channel. ${POSITIONING.moneyFlow}`,
    },
  },
};

/* ------------------------------------------------------------------ */
/* About / FAQ / legal                                                  */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  role: `NDIG is a ${POSITIONING.institutionNoun}, not a payment processor. It never holds investor funds - every transaction settles through licensed banks and custodians, directly between a diaspora investor and the institution. NDIG's role is to check that path against public regulatory records and show you what it found.`,
};

export const FAQ_COPY = {
  whatIsNdig:
    "NDIG (Nigeria Diaspora Investment Gateway) is a private-sector, independent verification institution. We check institutions and opportunities - diaspora bonds, NRNIA accounts, and other offers - against public regulatory records and point diaspora investors to the licensed institution. NDIG is founded and operated by NAKACHI Consulting.",
  isGovernmentAgency:
    "No. NDIG is a private-sector institution, not a government agency. We are regulator-vetted, meaning every institution and product listed on NDIG has been screened against the relevant Nigerian regulator (CBN, SEC, NIPC, NiDCOM) before appearing on the platform. NDIG is independent of government: it receives no state money and carries no state endorsement.",
  holdsMoney: `No, never. NDIG does not provide investment advice, and does not collect or hold investor funds. NDIG is a ${POSITIONING.institutionNoun}. ${POSITIONING.moneyFlow}`,
  howToRegister: `Click "Register Interest" anywhere on the site and complete the short form (name, email, location, and investment capacity). Registering does not commit you to anything and does not involve any payment - it simply connects you with verified opportunities and generates your unique ${POSITIONING.referenceName.toLowerCase()}.`,
  referenceQuestion: `What is a ${POSITIONING.referenceName.toLowerCase()}?`,
  referenceAnswer: `When you register your interest or ask NDIG to verify an opportunity, NDIG issues a unique ${POSITIONING.referenceName.toLowerCase()}. Dossier references can be checked at /verify. Quote your reference when you contact NDIG or a licensed institution so your record can be found. NDIG never collects payment through the reference; it is an identifier only.`,
};

export const TERMS = {
  referencesHeading: `4. ${POSITIONING.referenceName}s`,
  referencesBody: `When you register interest or request a verification, NDIG issues you a unique ${POSITIONING.referenceName.toLowerCase()}. It is an identifier only - it lets NDIG and the licensed institution you choose find your record. ${POSITIONING.referenceName}s carry no monetary value, cannot be transferred or sold, and do not constitute a financial instrument.`,
};

export const PRIVACY = {
  use: `We use your information to verify your registration, issue and track your unique ${POSITIONING.referenceName.toLowerCase()}, communicate with you about verifications and platform updates, respond to enquiries and complaints raised through the Trust Centre, and improve the platform. We do not use your information to make investment decisions on your behalf - NDIG does not provide investment advice.`,
  share: `We never sell your personal information. We share it only with the specific licensed institution you choose to engage with (for example, so a bank can process your NRNIA application, or so an institution can match your record to your ${POSITIONING.referenceName.toLowerCase()}), and with service providers who help us operate the platform under confidentiality obligations. We do not share your information with unrelated third parties.`,
};

export const REGISTRATION = {
  description: "Register to hear from NDIG about verified, regulator-vetted opportunities. We'll be in touch within 48 hours.",
  referenceLabel: `Your ${POSITIONING.referenceName}`,
};

export const VOD_COPY = {
  registrationVideoTitle: `From Registration to ${POSITIONING.referenceName}`,
};

export const SOVEREIGN_BRIEF = {
  nrniaSummary: "A look at adoption of the Non-Resident Nigerian Investment Account since its launch.",
};

export const CONCEPT_NOTE = {
  problem: `Nigeria's diaspora sent ${HERO_STATS[0].value} home in 2024 (${HERO_STATS[0].source}) - overwhelmingly into consumption rather than productive investment. The instruments to convert that flow into lasting wealth already exist: diaspora bonds, NRNIA accounts, vetted development projects. What has been missing is not opportunity, but a trusted, verified front door to it.`,
};

/* FMBN Diaspora Mortgage: FMBN's loan terms are not on the verified ledger, so the
   site states no figures or dates and links to FMBN's own announcement instead. */
export const HOMEFUND = {
  intro:
    "The Federal Mortgage Bank of Nigeria has launched an NHF Diaspora Mortgage Loan for eligible contributors abroad. Loan limits, rates and tenor are set by FMBN.",
  sourceNote:
    "Source: FMBN press release on the launch (fmbn.gov.ng). Terms are FMBN's; confirm them with FMBN before relying on them.",
  footer: "FMBN's NHF Diaspora Mortgage Loan. NDIG links to the source.",
};

export const DIASPORA_READINESS = {
  nrbvnCta: "Get Your NRBVN (Free)",
};

/* Dossier card (verification component) */
export const DOSSIER = {
  title: "VERIFIED BY NDIG",
  subtitle: "The Nigeria Diaspora Investment Gateway",
  statusPrefix: "STATUS:",
  statusText: { CONFIRMED: "CONFIRMED", FLAGGED: "FLAGGED", REJECTED: "REJECTED", PENDING: "UNDER REVIEW" },
  labels: { reference: "Reference", date: "Date", subject: "Subject", checkedAgainst: "Checked against" },
  illustrative: "Illustrative example",
  ariaPrefix: "NDIG verification dossier",
  sealLabel: "Verified by NDIG seal",
};

/* Verify flows */
export const VERIFY = {
  eyebrow: "Verification",
  opportunity: {
    title: "Verify an Opportunity",
    intro: "Tell us which institution or offer you want checked. We check it against public regulatory records and issue a numbered dossier.",
    resultTitle: "Your dossier has been opened",
    resultIntro: "Keep your reference. The status updates here when our check is complete, and we will email you.",
    checkThis: "Check this dossier",
    another: "Verify another opportunity",
    fields: {
      subject: "What should we verify?",
      subjectPlaceholder: "Institution, product or offer name",
      regulator: "Regulator it claims",
      link: "Website, link or contact (optional)",
      details: "What were you offered? (optional)",
      name: "Your name",
      email: "Your email",
    },
    regulators: [
      { value: "", label: "Not sure / not stated" },
      { value: "SEC", label: "SEC Nigeria" },
      { value: "CBN", label: "Central Bank of Nigeria (CBN)" },
      { value: "NAICOM", label: "NAICOM" },
      { value: "PenCom", label: "PenCom" },
      { value: "NUPRC", label: "NUPRC" },
      { value: "NIPC", label: "NIPC" },
    ],
    error: "We could not open your dossier. Please try again, or email info@ndigateway.org.",
    disclaimer: "NDIG does not hold funds, sell products or give investment advice. A dossier records what public records show on the date of the check.",
    submit: "Open my dossier",
  },
  dossier: {
    title: "Verify a Dossier",
    intro: "Every NDIG dossier carries a reference number. Enter it to see the dossier exactly as NDIG issued it.",
    label: "Dossier reference",
    placeholder: "NDIG-2026-948A1C",
    submit: "Verify",
    formatError: "References look like NDIG-2026-948A1C.",
    notFoundTitle: (ref: string) => `No dossier matches ${ref}.`,
    notFoundBody: "If someone gave you this reference as an NDIG document, treat it as unverified and contact NDIG before you act on it.",
    lookupError: "We could not check that reference right now. Please try again shortly.",
    officialTitle: "Verify an official or Anchor",
    officialBody: "This is the NDIG seal. It appears only on numbered NDIG dossiers and on materials NDIG has issued. If someone presents themselves as an NDIG official or Country Anchor, ask for a dossier reference and check it above, or confirm with us directly before you share money or documents.",
    contact: "Contact NDIG",
    wantChecked: "Want something checked?",
    wantCheckedLink: "Verify an Opportunity",
  },
};

/* Trust Centre: "What verification looks like". Fictional subjects; cards show "Illustrative example". */
export const VERIFICATION_EXAMPLES = {
  heading: "What verification looks like",
  cta: "Verify an Opportunity",
  items: [
    {
      heading: "Confirmed",
      explanation:
        "The institution or instrument appears on the public regulatory records we checked, and the details you gave us match them: name, registration and licence status. A confirmed dossier records what was true on the date of the check. It is not investment advice, and it does not mean NDIG recommends the opportunity.",
      card: {
        reference: "NDIG-2026-948A1C",
        date: "2026-10-14",
        subject: "Block participation offer — 2026 Licensing Round",
        checkedAgainst: "NUPRC · CAC · Corporate records",
        status: "CONFIRMED" as const,
      },
    },
    {
      heading: "Flagged",
      explanation:
        "Something did not match, or could not be confirmed from public records: a licence that has lapsed, a name that differs from the register, or a record we could not find. A flag is a reason to stop and ask questions before you send money. The dossier lists exactly what we found so you can raise it with the provider.",
      card: {
        reference: "NDIG-2026-B90E52",
        date: "2026-10-08",
        subject: "Sample Homes Development Co.: off-plan estate offer",
        checkedAgainst: "CAC · State land registry notice",
        status: "FLAGGED" as const,
      },
    },
    {
      heading: "Rejected",
      explanation:
        "The institution or instrument is not on the register it claims to be on, or a regulator has issued a public warning against it. Do not send money. If you have already paid, contact the regulator named in the dossier and reach out to NDIG.",
      card: {
        reference: "NDIG-2026-C3D418",
        date: "2026-10-09",
        subject: "Placeholder Diaspora Yield Fund: 30% monthly return scheme",
        checkedAgainst: "SEC Nigeria register · SEC public warnings list",
        status: "REJECTED" as const,
      },
    },
  ],
};
