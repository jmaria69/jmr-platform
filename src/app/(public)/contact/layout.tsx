import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Praxia Labs',
  description: 'Tell us about your project. Free 15-minute diagnostic, operational within 48 hours.',
  alternates: {
    canonical: '/contact',
    languages: { es: '/contacto', 'x-default': '/contacto' },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
