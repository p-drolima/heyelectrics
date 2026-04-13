import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy | Hey Electrics",
  description: "How Hey Electrics collects, uses and protects your personal data.",
};

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ number, title, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-black flex items-baseline gap-3">
        <span className="text-[#44B4D7] font-mono text-sm font-semibold shrink-0">{number}.</span>
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-3 pl-6">{children}</div>
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#44B4D7] shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">

          {/* Heading */}
          <div className="mb-14">
            <p className="text-sm font-medium text-[#44B4D7] mb-3 tracking-wide uppercase">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black font-display mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">Last updated: April 2026</p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-gray-100 space-y-10">

            <Section number="1" title="Introduction">
              <p>
                This Privacy Policy explains how <strong className="text-black">HEY HOMES GROUP LTD</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, and protects your personal data when you visit our website{" "}
                <a href="https://heyelectrics.co.uk/" className="text-[#44B4D7] hover:underline">https://heyelectrics.co.uk/</a>{" "}
                or use our services.
              </p>
              <p>
                We are committed to protecting your privacy and complying with the UK GDPR and the Data Protection Act 2018.
              </p>
            </Section>

            <div className="pt-10">
              <Section number="2" title="Company Details">
                <div className="space-y-1">
                  <p><span className="text-black font-medium">Business Name:</span> HEY HOMES GROUP LTD</p>
                  <p><span className="text-black font-medium">Registered Address:</span> Sunrise House, Hulley Road, Macclesfield, England, SK10 2LP</p>
                  <p>
                    <span className="text-black font-medium">Contact Email:</span>{" "}
                    <a href="mailto:info@heyelectrics.co.uk" className="text-[#44B4D7] hover:underline">info@heyelectrics.co.uk</a>
                  </p>
                </div>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="3" title="What Data We Collect">
                <p>We may collect and process the following personal data:</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-black font-medium mb-2">Information you provide directly:</p>
                    <Ul items={["Name", "Email address", "Phone number", "Property address", "Job or service details", "Information submitted via contact forms or booking systems"]} />
                  </div>
                  <div>
                    <p className="text-black font-medium mb-2">Payment information:</p>
                    <Ul items={["Payment details are collected securely by Stripe", "We do not store card details on our systems"]} />
                  </div>
                  <div>
                    <p className="text-black font-medium mb-2">Automatically collected data:</p>
                    <Ul items={["IP address", "Device and browser type", "Website usage data (via analytics tools)"]} />
                  </div>
                </div>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="4" title="How We Collect Your Data">
                <p>We collect data through:</p>
                <Ul items={["Contact forms", "Booking and service request forms", "Payment checkout processes", "Phone and email enquiries", "Cookies and tracking technologies"]} />
              </Section>
            </div>

            <div className="pt-10">
              <Section number="5" title="How We Use Your Data">
                <p>We use your data to:</p>
                <Ul items={["Respond to enquiries and provide quotes", "Deliver booked services", "Process payments", "Improve our website and services", "Analyse user behaviour and website performance", "Deliver relevant advertising (e.g. remarketing)"]} />
              </Section>
            </div>

            <div className="pt-10">
              <Section number="6" title="Legal Basis for Processing">
                <p>Under UK GDPR, we rely on the following legal bases:</p>
                <Ul items={["Contractual necessity – to deliver services you request", "Legitimate interests – to improve our services and website", "Consent – for cookies and remarketing activities"]} />
              </Section>
            </div>

            <div className="pt-10">
              <Section number="7" title="Payment Processing">
                <p>All payments are securely processed by Stripe. Stripe may collect and process personal and payment data for:</p>
                <Ul items={["Payment processing", "Fraud prevention", "Regulatory compliance"]} />
                <p>Your data may be transferred outside the UK/EEA where necessary, with appropriate safeguards in place.</p>
                <p>We do not store or have access to your full card details.</p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="8" title="Data Sharing">
                <p>We may share your data with trusted third parties, including:</p>
                <Ul items={["Payment processors (e.g. Stripe)", "Analytics providers (e.g. Google Analytics)", "Advertising platforms (e.g. Google Ads / remarketing)", "Website analytics tools (e.g. Microsoft Clarity)"]} />
                <p>We only share data necessary for these services and ensure appropriate safeguards are in place.</p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="9" title="Data Retention">
                <p>We retain personal data only as long as necessary:</p>
                <Ul items={["Customer and service data: up to 6 years (for legal and accounting purposes)", "Enquiries: up to 12 months", "Analytics data: as per platform defaults", "Marketing cookies: until consent is withdrawn"]} />
              </Section>
            </div>

            <div className="pt-10">
              <Section number="10" title="Cookies & Tracking">
                <p>We use cookies and similar technologies to:</p>
                <Ul items={["Ensure website functionality", "Analyse performance", "Support advertising and remarketing"]} />
                <p>We use a cookie consent tool to manage your preferences. You can update or withdraw consent at any time.</p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="11" title="Your Rights">
                <p>Under UK GDPR, you have the right to:</p>
                <Ul items={["Access your personal data", "Request correction of inaccurate data", "Request deletion of your data", "Object to or restrict processing", "Request data portability"]} />
                <p>
                  To exercise your rights, contact us at{" "}
                  <a href="mailto:info@heyelectrics.co.uk" className="text-[#44B4D7] hover:underline">info@heyelectrics.co.uk</a>.
                  We will respond within one month.
                </p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="12" title="Data Security">
                <p>We take appropriate technical and organisational measures to protect your data, including:</p>
                <Ul items={["Secure hosting environments", "Encrypted payment processing via Stripe", "Restricted access to personal data"]} />
              </Section>
            </div>

            <div className="pt-10">
              <Section number="13" title="Third-Party Links">
                <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="14" title="Updates to This Policy">
                <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
              </Section>
            </div>

            <div className="pt-10">
              <Section number="15" title="Contact Us">
                <p>If you have any questions about this Privacy Policy or your data, please contact:</p>
                <div className="space-y-1">
                  <p className="text-black font-medium">HEY HOMES GROUP LTD</p>
                  <p>
                    <a href="mailto:info@heyelectrics.co.uk" className="text-[#44B4D7] hover:underline">info@heyelectrics.co.uk</a>
                  </p>
                </div>
              </Section>
            </div>

          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link href="/" className="text-sm text-[#44B4D7] hover:underline font-medium">
              ← Back to home
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
