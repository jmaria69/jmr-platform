import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Eye, FileCheck, ServerCog, KeyRound } from 'lucide-react';
import { ResponsivePraxiaLabLogo } from '@/components/public/responsive-logo';
import { CONTACT_EMAIL } from '@/lib/constants';

const BASE_URL = 'https://praxialabs.com';

export const metadata: Metadata = {
  title: 'Seguridad y privacidad',
  description:
    'Cómo protegemos los datos de tu empresa: cifrado, control de acceso, cumplimiento RGPD, monitorización 24/7 y respuesta a incidentes. Seguridad de verdad, no una casilla marcada.',
  alternates: {
    canonical: '/seguridad',
  },
};

const pilares = [
  {
    icon: Lock,
    title: 'Cifrado en tránsito y en reposo',
    description:
      'Todo el tráfico viaja por HTTPS/TLS. Las contraseñas se almacenan con hash, nunca en claro, y las credenciales sensibles se guardan en variables de entorno cifradas, fuera del código.',
  },
  {
    icon: KeyRound,
    title: 'Acceso con doble factor',
    description:
      'El panel de administración exige autenticación en dos pasos (TOTP) y bloquea IPs tras varios intentos fallidos. Nadie entra solo con una contraseña filtrada.',
  },
  {
    icon: Eye,
    title: 'Monitorización activa de amenazas',
    description:
      'Detección de bots maliciosos, fuerza bruta y tokens inválidos en tiempo real, con alertas inmediatas al equipo. No esperamos a que nos avises tú de un incidente.',
  },
  {
    icon: ServerCog,
    title: 'Protección de borde (WAF)',
    description:
      'El tráfico pasa por reglas de firewall a nivel de red antes de llegar a nuestros servidores, filtrando ataques conocidos (inyección, escaneo, explotación de CVEs) antes de que sean tu problema.',
  },
  {
    icon: FileCheck,
    title: 'RGPD desde el diseño',
    description:
      'Recogemos el mínimo dato necesario, con base legal clara para cada tratamiento y plazos de conservación definidos. Puedes acceder, rectificar o suprimir tus datos cuando quieras.',
  },
  {
    icon: ShieldCheck,
    title: 'Preparados para NIS2',
    description:
      'Diseñamos los agentes que gestionan procesos críticos con los mismos criterios que exige la directiva NIS2: registro de eventos, gestión de incidentes y planes de continuidad.',
  },
];

const faqs = [
  {
    q: '¿Dónde se alojan los datos de mi empresa?',
    a: 'La aplicación se sirve desde infraestructura europea (Vercel, región de París). Algunos servicios auxiliares (como la base de datos gestionada) pueden operar en otras regiones de proveedores cloud reconocidos; si tu proyecto requiere residencia de datos estrictamente en la UE, lo configuramos como requisito del contrato antes de empezar.',
  },
  {
    q: '¿Cumplís el RGPD?',
    a: 'Sí. Actuamos como responsables o encargados del tratamiento según el caso, con base legal documentada para cada dato que recogemos, plazos de conservación definidos y canal directo para ejercer tus derechos de acceso, rectificación, supresión y portabilidad.',
  },
  {
    q: '¿Usáis mis datos para entrenar modelos de IA?',
    a: 'No. Los datos de tu empresa se usan exclusivamente para operar los agentes que construimos para ti. No se reutilizan para entrenar modelos propios ni se comparten con terceros para ese fin.',
  },
  {
    q: '¿Qué pasa si detectáis un incidente de seguridad?',
    a: 'Tenemos monitorización 24/7 con alertas automáticas. Ante un incidente que afecte a tus datos, te lo comunicamos según los plazos que marca el RGPD, junto con las medidas tomadas para contenerlo.',
  },
  {
    q: '¿Puedo pedir una auditoría o revisión de seguridad antes de contratar?',
    a: 'Sí. En el diagnóstico inicial de 15 minutos podemos repasar los controles de seguridad relevantes para tu caso, y lo documentamos por escrito si lo necesitas para tu propio departamento de compras o IT.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Seguridad y privacidad', item: `${BASE_URL}/seguridad` },
  ],
};

export default function SeguridadPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#e8e8f0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ResponsivePraxiaLabLogo />
            <div>
              <h1 className="text-2xl font-black text-white">Praxia Labs</h1>
              <p className="text-sm text-gray-400">Seguridad y privacidad</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Automatizar tu empresa no debería<br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              significar exponer tus datos.
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            Cada agente que construimos toca información sensible de tu negocio: facturas, clientes,
            comunicaciones internas. Por eso la seguridad no es un anexo del contrato, es parte del diseño
            desde el primer día.
          </p>
        </div>

        {/* Pilares */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Cómo protegemos tus datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pilares.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl border border-purple-500/20 glass hover:border-purple-500/40 transition">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Preguntas frecuentes</h3>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-6 rounded-2xl border border-cyan-500/20 glass">
                <h4 className="font-bold text-white mb-2">{f.q}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-16">
          Más detalle sobre qué datos recogemos y tus derechos en nuestra{' '}
          <Link href="/politica-privacidad" className="text-cyan-400 hover:underline">
            política de privacidad
          </Link>.
        </p>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl border border-purple-500/30 glass-strong">
          <h3 className="text-2xl font-bold text-white mb-3">¿Tu equipo de IT o compras tiene preguntas?</h3>
          <p className="text-gray-400 mb-8">
            Escríbenos directamente o resérvalas para el diagnóstico inicial. Respondemos con detalle técnico,
            no con una FAQ genérica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
            >
              Reservar diagnóstico gratuito <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
