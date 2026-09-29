import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Cpu, MapPin, ShieldCheck, Sparkles, Zap } from "lucide-react";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "Automatización con IA para Empresas en Madrid | Praxia Labs",
  description:
    "Implementación de agentes de IA y automatización de procesos para empresas y despachos en Madrid. Extracción de facturas, agentes operativos y ahorro de hasta 40h/mes.",
  keywords: [
    "automatización IA Madrid",
    "inteligencia artificial empresas Madrid",
    "agentes IA Madrid",
    "automatizar facturas Madrid",
    "consultoría IA Madrid pymes",
    "Praxia Labs Madrid",
  ],
  alternates: {
    canonical: "/automatizacion-ia-madrid",
    languages: { "x-default": "/automatizacion-ia-madrid", es: "/automatizacion-ia-madrid" },
  },
  openGraph: {
    title: "Automatización con IA para Empresas en Madrid | Praxia Labs",
    description:
      "Automatización inteligente de procesos y agentes autónomos para empresas en la Comunidad de Madrid. Piloto funcional en 48 horas.",
    url: `${BASE_URL}/automatizacion-ia-madrid`,
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
      "@id": `${BASE_URL}/automatizacion-ia-madrid#business`,
      name: "Praxia Labs — Automatización e IA Madrid",
      description:
        "Servicios de automatización de procesos mediante agentes de Inteligencia Artificial para empresas, asesorías y despachos en la Comunidad de Madrid.",
      url: `${BASE_URL}/automatizacion-ia-madrid`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Madrid",
        addressRegion: "Comunidad de Madrid",
        addressCountry: "ES",
      },
      areaServed: [
        { "@type": "City", name: "Madrid" },
        { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
        { "@type": "City", name: "Alcobendas" },
        { "@type": "City", name: "Las Rozas" },
        { "@type": "City", name: "Getafe" },
      ],
      priceRange: "$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/automatizacion-ia-madrid#service`,
      name: "Agentes de IA y Automatización Empresarial en Madrid",
      serviceType: "Consultoría y Desarrollo de IA Aplicada",
      provider: {
        "@type": "Organization",
        name: "Praxia Labs",
        url: BASE_URL,
      },
      areaServed: "Madrid",
    },
  ],
};

const MADRID_HUBS = [
  { name: "Madrid Capital & Castellana", focus: "Servicios financieros, firmas legales y despachos corporativos." },
  { name: "Alcobendas & San Sebastián", focus: "Sedes tecnológicas, farmacéuticas y logística avanzada." },
  { name: "Las Rozas & Pozuelo", focus: "Startups B2B, consultoría de software y comercio digital." },
  { name: "Getafe, Leganés & Corredor del Henares", focus: "Empresas industriales, distribución y fabricación." },
];

const CASOS_USO = [
  {
    icon: Zap,
    title: "Procesamiento de Facturas en 3 Segundos",
    desc: "Extracción automática de NIF, emisor, líneas y retenciones desde cualquier PDF sin plantillas fijas. Volcado directo a SAP, A3, Holded o Sage.",
    stat: "99.4% precisión",
  },
  {
    icon: Bot,
    title: "Agentes Autónomos de Soporte y Back-Office",
    desc: "Resolución de consultas repetitivas de clientes y proveedores vía WhatsApp o web con contexto real de tu base de datos.",
    stat: "-75% tiempo de respuesta",
  },
  {
    icon: Cpu,
    title: "IA Privada Soberana (AirGap Local)",
    desc: "Modelos ejecutados 100% on-premise en tu infraestructura madrileña, garantizando secreto profesional y cumplimiento estricto de RGPD.",
    stat: "Zero Telemetría",
  },
];

export default function AutomatizacionMadridPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <main className="relative min-h-screen bg-[#070714] text-slate-100 overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Badge & Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Servicio para Empresas en la Comunidad de Madrid</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Automatización con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
                Inteligencia Artificial
              </span>{" "}
              en Madrid
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed">
              Liberamos a tu equipo de las tareas manuales que frenan el crecimiento. Implementamos agentes autónomos en tu negocio operativo en menos de 48 horas.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-95 shadow-lg shadow-violet-500/20 transition-all group"
              >
                <span>Solicitar diagnóstico gratuito en Madrid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/automatizar-facturas-ia"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
              >
                <span>Ver demo de facturas</span>
              </Link>
            </div>
          </div>

          {/* Key Metric strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-violet-400">40h/mes</div>
              <div className="text-xs text-slate-400">Ahorro medio por empleado</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-cyan-400">&lt; 3 seg</div>
              <div className="text-xs text-slate-400">Tiempo de procesamiento</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-emerald-400">48 horas</div>
              <div className="text-xs text-slate-400">Puesta en marcha piloto</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-amber-400">0 €</div>
              <div className="text-xs text-slate-400">Coste de diagnóstico inicial</div>
            </div>
          </div>

          {/* Solutions Cards */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Soluciones de IA Adaptadas al Tejido Madrileño</h2>
              <p className="text-sm text-slate-400">Agentes construidos sobre código e infraestructura europea sin depender de consultoras lentas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CASOS_USO.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-violet-500/50 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span>{item.stat}</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Madrid Ecosystem Hubs */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/60 p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Cobertura en Polígonos y Áreas de Negocio de Madrid</span>
              </h2>
              <p className="text-sm text-slate-400">
                Atendemos tanto de forma remota como presencial para despliegues locales on-premise en toda la Comunidad de Madrid:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MADRID_HUBS.map((hub, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-1">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{hub.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">{hub.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="text-center rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/40 p-8 sm:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Cuánto tiempo pierde tu empresa en Madrid con tareas manuales?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Te proponemos un diagnóstico de 15 minutos. Analizamos tus flujos de trabajo actuales y te mostramos un piloto funcionando con tus propios documentos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-95 shadow-xl shadow-cyan-500/20 transition-all"
              >
                <span>Reservar diagnóstico de 15 minutos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
