import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Cpu, MapPin, Sparkles, Zap } from "lucide-react";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "Automatización con IA para Empresas en Barcelona | Praxia Labs",
  description:
    "Implementación de agentes de IA y automatización contable y operativa para empresas en Barcelona y Cataluña. Extracción de facturas en 3s y reducción drástica de tiempos.",
  keywords: [
    "automatización IA Barcelona",
    "inteligencia artificial empresas Barcelona",
    "agentes IA Cataluña",
    "automatizar facturas Barcelona",
    "automatització processos pimes Barcelona",
    "Praxia Labs Barcelona",
  ],
  alternates: {
    canonical: "/automatizacion-ia-barcelona",
    languages: { "x-default": "/automatizacion-ia-barcelona", es: "/automatizacion-ia-barcelona" },
  },
  openGraph: {
    title: "Automatización con IA para Empresas en Barcelona | Praxia Labs",
    description:
      "Automatización inteligente de procesos y agentes de IA para PYMEs en Barcelona y área metropolitana. Piloto funcional en 48 horas.",
    url: `${BASE_URL}/automatizacion-ia-barcelona`,
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
      "@id": `${BASE_URL}/automatizacion-ia-barcelona#business`,
      name: "Praxia Labs — Automatización e IA Barcelona",
      description:
        "Servicios de automatización de procesos con agentes de Inteligencia Artificial para empresas, asesorías e industrias en Barcelona y Cataluña.",
      url: `${BASE_URL}/automatizacion-ia-barcelona`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Barcelona",
        addressRegion: "Catalunya",
        addressCountry: "ES",
      },
      areaServed: [
        { "@type": "City", name: "Barcelona" },
        { "@type": "AdministrativeArea", name: "Catalunya" },
        { "@type": "City", name: "Hospitalet de Llobregat" },
        { "@type": "City", name: "Sabadell" },
        { "@type": "City", name: "Terrassa" },
      ],
      priceRange: "$$",
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/automatizacion-ia-barcelona#service`,
      name: "Agentes de IA y Automatización Empresarial en Barcelona",
      serviceType: "Consultoría y Desarrollo de IA Aplicada",
      provider: {
        "@type": "Organization",
        name: "Praxia Labs",
        url: BASE_URL,
      },
      areaServed: "Barcelona",
    },
  ],
};

const BARCELONA_HUBS = [
  { name: "Districte 22@ & Poblenou", focus: "Hub de tecnología, software B2B, marketing y diseño digital." },
  { name: "Vallès Occidental (Sabadell, Terrassa, Rubí)", focus: "Tejido industrial, manufactura, automoción y distribución." },
  { name: "Baix Llobregat & Port de Barcelona", focus: "Logística internacional, transporte, import-export y comercio exterior." },
  { name: "Eixample & Diagonal Corporativo", focus: "Bufetes de abogados, gestorías administrativas y despachos profesionales." },
];

export default function AutomatizacionBarcelonaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <main className="relative min-h-screen bg-[#070714] text-slate-100 overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Servicio para Empresas en Barcelona y Cataluña</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Automatización con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-indigo-400">
                Inteligencia Artificial
              </span>{" "}
              en Barcelona
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed">
              Optimizamos los procesos operativos y contables de tu empresa. Agentes de visión y LLMs que integran tus datos con tu software actual en menos de 48 horas.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all group"
              >
                <span>Solicitar diagnóstico en Barcelona</span>
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

          {/* Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-cyan-400">40h/mes</div>
              <div className="text-xs text-slate-400">Ahorro medio en gestión</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-violet-400">3 seg</div>
              <div className="text-xs text-slate-400">Extracción por documento</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-emerald-400">48h</div>
              <div className="text-xs text-slate-400">Piloto en tu infraestructura</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-amber-400">0 €</div>
              <div className="text-xs text-slate-400">Coste de auditoría inicial</div>
            </div>
          </div>

          {/* Hubs */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/60 p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Adaptado a los Polos de Negocio de Barcelona y su Área Metropolitana</span>
              </h2>
              <p className="text-sm text-slate-400">
                Apoyamos a pymes y despachos en sus procesos de transición digital con tecnología de IA práctica:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BARCELONA_HUBS.map((hub, i) => (
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

          {/* CTA */}
          <div className="text-center rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-violet-950/40 p-8 sm:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Quieres comprobar el impacto en tus propios números?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              En una llamada de 15 minutos cargamos ejemplos de tus proveedores y compruebas el circuito completo sin compromiso.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:opacity-95 shadow-xl shadow-cyan-500/20 transition-all"
              >
                <span>Solicitar diagnóstico gratuito</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
