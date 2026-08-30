import type { Metadata } from 'next';
import Link from 'next/link';
import { PraxiaLabLogo } from '@/components/praxia-lab-logo';
import { CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy — Praxia Labs',
  description:
    'What data Praxia Labs collects, why we use it, how long we keep it, and how to exercise your rights of access, rectification, or erasure.',
  alternates: {
    canonical: '/privacy',
    languages: { es: '/politica-privacidad', 'x-default': '/politica-privacidad' },
  },
};

export default function PrivacyPage() {
  return (
    <div lang="en" className="min-h-screen bg-transparent text-[#e8e8f0]">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <div className="flex items-center gap-3 mb-4">
          <PraxiaLabLogo size={40} />
          <div>
            <h1 className="text-2xl font-black text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Praxia Labs · Madrid, Spain</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-10">
          <Link href="/politica-privacidad" className="text-cyan-400 hover:underline">Versión en español</Link>
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <p>
              This policy explains what personal data Praxia Labs processes through
              praxialabs.com, for what purpose, for how long, and how you can exercise your
              rights. We are the data controller: you can contact us at any time at{' '}
              <a className="text-cyan-400 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">What data we collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <b className="text-white">Contact form:</b> name, email, company (optional),
                project type, and the message you send us. Used exclusively to respond to your
                diagnostic request or inquiry.
              </li>
              <li>
                <b className="text-white">Web analytics (Google Analytics 4):</b> pages visited,
                traffic source, and aggregated usage data, collected first-party. Not active on
                the admin panel, only on public pages.
              </li>
              <li>
                <b className="text-white">Security and abuse prevention:</b> IP address, user
                agent, and requested path, logged temporarily to detect malicious bots, limit
                abusive requests (rate limiting), and protect access to the admin panel. These
                logs are kept for a maximum of 24 hours and are not used for commercial purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Legal basis and retention</h2>
            <p>
              We process contact form data based on your explicit consent when you submit it, and
              we keep it for as long as the business relationship lasts or until you request its
              deletion. Analytics and security data are based on our legitimate interest in
              understanding site usage and protecting it against abuse, and are kept for the
              minimum time necessary for that purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Who we share data with</h2>
            <p>
              We do not sell or share your data with third parties for advertising purposes. We
              use infrastructure providers (hosting, database, email delivery, and analytics)
              strictly to operate the service, under their corresponding data processing
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your rights</h2>
            <p>
              You can exercise your rights of access, rectification, erasure, objection,
              restriction, and portability by writing to{' '}
              <a className="text-cyan-400 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              We will respond within a reasonable timeframe, and if you believe it necessary, you
              can file a complaint with the Spanish Data Protection Agency (aepd.es).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to this policy</h2>
            <p>
              We may update this page to reflect changes in the service or applicable
              regulations. Last revised: August 2026.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
