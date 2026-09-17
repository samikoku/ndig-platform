import { Eye } from "lucide-react";

export default function Accessibility() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <Eye className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Accessibility</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Accessibility Statement
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Last updated: 18 September 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-10 text-sm md:text-base leading-relaxed text-foreground">
            <p>
              NDIG is built for the Nigerian diaspora worldwide, which means it has to work for
              investors of every ability, on every device, in every region. We are committed to making
              www.ndigateway.org accessible to as many people as possible.
            </p>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Our Standard</h2>
              <p>
                We design and build NDIG to meet the Web Content Accessibility Guidelines (WCAG) 2.1
                Level AA, the internationally recognised benchmark for web accessibility. This is an
                ongoing commitment - as we add features, we review them against this standard.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Keyboard Navigation</h2>
              <p>
                Every interactive element on NDIG - navigation links, forms, buttons, and dialogs - can
                be reached and operated using a keyboard alone, with visible focus states so you always
                know where you are on the page.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Screen Reader Compatibility</h2>
              <p>
                Pages are structured with semantic HTML and appropriate labelling so that screen readers
                can accurately announce headings, form fields, buttons, and status messages, including
                confirmation of a successful registration or newsletter signup.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Colour Contrast</h2>
              <p>
                Our palette - deep green, gold, and cream - is chosen and tested to meet WCAG AA contrast
                ratios for text against its background, in both the primary theme and dark backgrounds
                such as the masthead and footer.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-3">Feedback</h2>
              <p>
                If you encounter an accessibility barrier anywhere on NDIG, please tell us. Include the
                page you were on and a description of the issue, and we will investigate and respond.
                Email{" "}
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
