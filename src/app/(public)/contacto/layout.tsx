import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Cuéntanos sobre tu proyecto. Diagnóstico gratuito de 15 minutos, operativo en 48 horas.',
  alternates: {
    canonical: '/contacto',
    languages: { en: '/contact', 'x-default': '/contacto' },
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
