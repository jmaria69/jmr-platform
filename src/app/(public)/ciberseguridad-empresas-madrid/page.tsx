import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2, MapPin, Shield, ShieldCheck, Terminal, Zap } from "lucide-react";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "Ciberseguridad y SOC Virtual para Empresas en Madrid | SIAM Praxia Labs",
  description:
    "Protección 24/7 y cumplimiento NIS2 para PYMEs en Madrid. Monitorización continua, cortafuegos WAF perimetral y señuelos Honeypot para neutralizar intrusiones.",
  keywords: [
    "ciberseguridad empresas Madrid",
    "SOC virtual Madrid",
    "cumplimiento NIS2 Madrid pymes",
    "auditoría ciberseguridad Madrid",
    "WAF y cortafuegos empresas Madrid",
    "SIAM Praxia Labs Madrid",
  ],
  alternates: {
    canonical: "/ciberseguridad-empresas-madrid",
    languages: { "x-default": "/ciberseguridad-empresas-madrid", es: "/ciberseguridad-empresas-madrid" },
  },
  openGraph: {
    title: "Ciberseguridad y SOC Virtual en Madrid | SIAM Praxia Labs",
    description:
      "Centro de Operaciones de Seguridad (SOC) 24/7 adaptado a PYMEs madrileñas. Detección, bloqueo perimetral y adaptación a la normativa europea NIS2.",
    url: `${BASE_URL}/ciberseguridad-empresas-madrid`,
    siteName: "Praxia Labs",
    locale: "es_ES",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/ciberseguridad-empresas-madrid#business`,
      name: "SIAM Praxia Labs — Ciberseguridad Madrid",
      description:
        "Servicios gestionados de ciberseguridad, cortafuegos perimetral WAF y SOC virtual para empresas en Madrid.",
      url: `${BASE_URL}/ciberseguridad-empresas-madrid`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Madrid",
        addressRegion: "Comunidad de Madrid",
        addressCountry: "ES",
      },
      areaServed: [
        { "@type": "City", name: "Madrid" },
        { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
      ],
      priceRange: "$$",
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/ciberseguridad-empresas-madrid#service`,
      name: "SOC Virtual y Ciberseguridad Activa en Madrid",
      serviceType: "Servicio de Ciberseguridad Gestionada",
      provider: {
        "@type": "Organization",
        name: "Praxia Labs",
        url: BASE_URL,
      },
      areaServed: "Madrid",
    },
  ],
};

const CARACTERISTICAS = [
  {
    icon: Shield,
    title: "Cortafuegos WAF Perimetral Activo",
    desc: "Bloqueo en tiempo real de inyecciones SQL, escaneos automáticos de bots y fuerza bruta antes de que alcancen tus servidores.",
    badge: "Bloqueo &lt; 5ms",
  },
  {
    icon: Terminal,
    title: "Trampas Inteligentes Honeypot",
    desc: "Servicios señuelo que detectan a atacantes explorando tu red y aíslan su IP antes de que toquen datos de producción confidenciales.",
    badge: "Detección temprana",
  },
  {
    icon: ShieldCheck,
    title: "Adecuación Directiva Europea NIS2",
    desc: "Registro de auditoría forense y notificación obligatoria de incidentes en menos de 24 horas, evitando sanciones económicas.",
    badge: "Conformidad legal",
  },
];

export default function CiberseguridadMadridPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <main className="relative min-h-screen bg-[#070714] text-slate-100 overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ciberseguridad Gestionada para PYMEs en la Comunidad de Madrid</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Ciberseguridad Activa y{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400">
                SOC Virtual 24/7
              </span>{" "}
              en Madrid
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed">
              El 70% de los ciberataques en España impactan en pequeñas y medianas empresas. Con SIAM blindas tu infraestructura sin necesidad de contratar un equipo de seguridad dedicado.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-cyan-600 hover:opacity-95 shadow-lg shadow-rose-500/20 transition-all group"
              >
                <span>Solicitar auditoría de exposición en Madrid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/soc-virtual-pymes"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
              >
                <span>Calculadora de riesgo NIS2</span>
              </Link>
            </div>
          </div>

          {/* Alert Callout */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-amber-300 text-sm sm:text-base">¿Cumple tu empresa en Madrid con la directiva NIS2?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Las empresas que forman parte de cadenas de suministro críticas están obligadas a registrar incidentes de seguridad y responder formalmente. SIAM deja la trazabilidad resuelta en automático.
              </p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARACTERISTICAS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-rose-500/50 transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-6 mt-4 border-t border-slate-800/80 text-xs font-semibold text-rose-400">
                  {item.badge}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-cyan-950/40 p-8 sm:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Comprueba la postura de seguridad de tu empresa en Madrid
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Te mostramos en directo el panel de SIAM con ataques reales bloqueados y auditamos tu exposición perimetral en 15 minutos sin compromiso.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-cyan-600 hover:opacity-95 shadow-xl shadow-rose-500/20 transition-all"
              >
                <span>Agendar demo de SIAM con un ingeniero</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
