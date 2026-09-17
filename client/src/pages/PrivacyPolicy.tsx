import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Privacy Policy</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Last updated: 18 September 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-10 text-sm md:text-base leading-relaxed text-foreground">
            <p>
              NDIG (Nigeria Diaspora Investment Gateway), operated by NAKACHI Consulting, respects your
              privacy. This policy explains what information we collect, how we use it, and the rights
              you have over it. It applies to www.ndigateway.org and all NDIG registration and
              communication channels.
            </p>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                When you register interest, subscribe to our newsletter, apply to become a Country
                Anchor, or otherwise interact with NDIG, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name and email address</li>
                <li>Phone number and country of residence</li>
                <li>Sector interest and risk appetite</li>
                <li>Whether you have family in Nigeria</li>
                <li>Any additional information you choose to share in free-text fields</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">2. How We Use Your Information</h2>
              <p>
                We use your information to verify your registration, generate and track your unique
                referral code, communicate with you about opportunities and platform updates, respond
                to enquiries and complaints raised through the Trust Centre, and improve the platform.
                We do not use your information to make investment decisions on your behalf - NDIG does
                not provide investment advice.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">3. How We Share Your Information</h2>
              <p>
                We never sell your personal information. We share it only with the specific licensed
                institution you choose to engage with (for example, so a bank can process your NRNIA
                application, or DMO can confirm your bond subscription against your referral code), and
                with service providers who help us operate the platform under confidentiality
                obligations. We do not share your information with unrelated third parties.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">4. Data Security</h2>
              <p>
                We use encryption in transit and at rest, and restrict access to your information to
                personnel and systems that need it to operate NDIG. No online platform can guarantee
                absolute security, but we maintain and regularly review technical and organisational
                safeguards appropriate to the sensitivity of the data we hold.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">5. Your Rights</h2>
              <p>
                In accordance with the Nigeria Data Protection Act / NDPR and, where applicable, the
                EU General Data Protection Regulation (GDPR), you have the right to access the personal
                information we hold about you, request correction of inaccurate information, request
                deletion of your information, and withdraw consent to marketing communications at any
                time (including via the unsubscribe link in every email). To exercise any of these
                rights, contact us using the details below.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">6. Contact</h2>
              <p>
                Questions about this policy or your personal information should be sent to{" "}
                <a href="mailto:ndig@nakachiconsulting.com.ng" className="text-primary font-medium hover:underline">
                  ndig@nakachiconsulting.com.ng
                </a>
                .
              </p>
            </div>

            <p className="text-xs text-muted-foreground pt-6 border-t border-border">
              NDIG does not provide investment advice, and does not collect or hold investor funds. All
              investments are made directly with the licensed institutions named.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
