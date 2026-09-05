import type { Metadata } from 'next';
import Link from 'next/link';
import { ResponsivePraxiaLabLogo } from '@/components/public/responsive-logo';
import { CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Qué datos recoge Praxia Labs, para qué los usamos, cuánto tiempo los conservamos y cómo ejercer tus derechos de acceso, rectificación o supresión.',
  alternates: {
    canonical: '/politica-privacidad',
    languages: { en: '/privacy', 'x-default': '/politica-privacidad' },
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#e8e8f0]">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <div className="flex items-center gap-3 mb-10">
          <ResponsivePraxiaLabLogo />
          <div>
            <h1 className="text-2xl font-black text-white">Política de privacidad</h1>
            <p className="text-sm text-gray-400">Praxia Labs · Madrid, España</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-10">
          <Link href="/privacy" className="text-cyan-400 hover:underline">English version</Link>
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <p>
              Esta política explica qué datos personales trata Praxia Labs a través de
              praxialabs.com, con qué finalidad, durante cuánto tiempo y cómo puedes ejercer tus
              derechos. Somos el responsable del tratamiento: puedes contactarnos en cualquier
              momento en <a className="text-cyan-400 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Qué datos recogemos</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <b className="text-white">Formulario de contacto:</b> nombre, email, empresa
                (opcional), tipo de proyecto y el mensaje que nos envías. Se usan exclusivamente
                para responder a tu solicitud de diagnóstico o consulta.
              </li>
              <li>
                <b className="text-white">Analítica web (Google Analytics 4):</b> páginas
                visitadas, origen del tráfico y datos de uso agregados, con recogida en primera
                parte (first-party). No se activa en el panel de administración, solo en las
                páginas públicas.
              </li>
              <li>
                <b className="text-white">Seguridad y prevención de abuso:</b> dirección IP,
                user-agent y ruta solicitada, registrados temporalmente para detectar bots
                maliciosos, limitar peticiones abusivas (rate limiting) y proteger el acceso al
                panel de administración. Estos registros se conservan un máximo de 24 horas y no
                se usan con fines comerciales.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Base legal y conservación</h2>
            <p>
              Tratamos los datos del formulario de contacto en base a tu consentimiento explícito
              al enviarlo, y los conservamos mientras dure la relación comercial o hasta que
              solicites su supresión. Los datos de analítica y seguridad se basan en nuestro
              interés legítimo en entender el uso del sitio y protegerlo frente a abusos, y se
              conservan el tiempo mínimo necesario para ese fin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Con quién compartimos datos</h2>
            <p>
              No vendemos ni cedemos tus datos a terceros con fines publicitarios. Usamos
              proveedores de infraestructura (hosting, base de datos, envío de email y analítica)
              estrictamente para operar el servicio, bajo sus correspondientes acuerdos de
              tratamiento de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Tus derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
              limitación y portabilidad escribiendo a{' '}
              <a className="text-cyan-400 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              Responderemos en un plazo razonable y, si lo consideras necesario, puedes reclamar
              ante la Agencia Española de Protección de Datos (aepd.es).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cambios en esta política</h2>
            <p>
              Podemos actualizar esta página para reflejar cambios en el servicio o en la
              normativa aplicable. La fecha de la última revisión es agosto de 2026.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
