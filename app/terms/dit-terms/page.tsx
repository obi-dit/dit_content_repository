import Link from "next/link";
import SubscribeNav from "../../components/subscribe/SubscribeNav";
import SubscribeFooter from "../../components/subscribe/SubscribeFooter";

const sections = [
  {
    id: "terms-of-service",
    title: "1. Terms of Service",
    paragraphs: [
      "Welcome to DIT Podcast Lounge. By accessing or using our services, you agree to these terms. This platform provides premium content for individuals over the age of 18.",
      "Subscriptions: Users may subscribe to Monthly, Quarterly, or Annual plans. Subscriptions automatically renew unless cancelled at least 24 hours prior to the next billing cycle. All payments are final.",
      "User Conduct: Users are encouraged to submit questions for our live shows via the dashboard interface. By submitting a question, you agree not to use abusive, offensive, or illegal language. The platform reserves the right to moderate or reject any submission.",
    ],
  },
  {
    id: "privacy-policy",
    title: "2. Privacy Policy",
    paragraphs: [
      "We are committed to protecting your privacy. We collect information necessary to provide our services, including account details, subscription status, and questions submitted for live events.",
      "We do not share your personal data with third parties, except as required for payment processing or legal compliance. Your data is used solely to enhance your experience within the DIT Podcast Lounge.",
    ],
  },
  {
    id: "content-policy",
    title: "3. Content Policy (18+)",
    paragraphs: [
      "DIT Podcast Lounge is intended strictly for an adult audience (18+). By accessing the site, you verify that you are at least 18 years of age. Content provided on this platform is for educational and entertainment purposes for men over 40.",
      "Users must not upload or submit content that is sexually explicit, hateful, or harassing. Any violation of these standards regarding content or submissions will result in immediate termination of account access.",
    ],
  },
  {
    id: "contact-support",
    title: "4. Contact Support",
    paragraphs: [
      "If you encounter issues with your subscription, have questions about your account, or need to report a policy violation, please contact our support team immediately.",
      "Email us at info@diversityintechnology.org. We aim to respond to all inquiries within 48 business hours.",
    ],
  },
];

export default function DitTermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscribeNav />

      <main className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-amber-500/90">
            Legal
          </p>
          <h1 className="mb-4 text-center text-3xl font-bold text-zinc-50 sm:text-4xl">
            DIT Podcast Lounge Policies
          </h1>
          <p className="mb-10 text-center text-zinc-400">
            Terms of Service, Privacy Policy, Content Policy, and support information.
          </p>

          <nav
            aria-label="Policy sections"
            className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-300">
              On this page
            </h2>
            <ul className="space-y-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="space-y-10 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-xl">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="mb-4 text-xl font-bold text-zinc-50 sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          <p className="mt-8 text-center text-sm text-zinc-500">
            <Link href="/subscribe" className="text-zinc-400 hover:text-zinc-300">
              ← Back to subscribe
            </Link>
          </p>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
