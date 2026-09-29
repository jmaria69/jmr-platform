import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, Database, EyeOff, Lock, Server, ShieldCheck, Zap } from "lucide-react";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "IA Privada On-Premise y Modelos Soberanos AirGap | Praxia Labs",
  description:
    "Despliega modelos de lenguaje y visión en tu propia infraestructura sin enviar datos a OpenAI ni a servidores de terceros. 100% privacidad, secreto industrial y RGPD.",
  keywords: [
    "IA privada empresas",
    "LLM on premise España",
    "AirGap AI soberana",
    "RAG local confidencial",
    "modelos lenguaje propios pymes",
    "Local Galaxy Praxia Labs",
  ],
  alternates: {
    canonical: "/ia-privada-local",
    languages: { "x-default": "/ia-privada-local", es: "/ia-privada-local" },
  },
  openGraph: {
    title: "IA Privada y Soberana On-Premise | Praxia Labs",
    description:
      "Tus datos confidenciales nunca salen de tu red. Modelos de IA ejecutados en hardware propio con arquitectura AirGap.",
    url: `${BASE_URL}/ia-privada-local`,
    siteName: "Praxia Labs",
    locale: "es_ES",
    type: "website",
  },
};

const FAQS = [
  {
    pregunta: "¿Qué hardware se necesita para ejecutar un LLM privado en nuestra empresa?",
    respuesta:
      "Dependiendo del volumen y del caso de uso, optimizamos los modelos para correr en servidores de oficina existentes (con aceleración por CPU moderna) o estaciones de trabajo con una o varias GPUs comerciales (NVIDIA RTX), reduciendo el coste frente a centros de datos masivos.",
  },
  {
    pregunta: "¿Es posible aislar la máquina completamente de Internet (AirGap)?",
    respuesta:
      "Sí. La arquitectura AirGap de Praxia Labs permite operar sin conexión a Internet física ni lógica. Las bases de datos vectoriales y las consultas quedan confinadas dentro de la red local (LAN), garantizando secreto empresarial y cumplimiento médico, legal o financiero.",
  },
  {
    pregunta: "¿La calidad de respuesta es comparable a ChatGPT?",
    respuesta:
      "Para tareas concretas de negocio (análisis de contratos, extracción contable, consulta de normativas internas o atención técnica), los modelos locales con RAG especializado superan en precisión y consistencia a modelos generales de la nube, sin inventar datos ni alucinar.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/ia-privada-local#software`,
      name: "Praxia Local Galaxy & AirGap AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Linux Server, On-Premise, Bare Metal, AirGap",
      description:
        "Infraestructura soberana de Inteligencia Artificial para despliegue de modelos de lenguaje (LLM), visión y búsqueda semántica RAG en servidores propios aislados de Internet.",
      provider: {
        "@type": "Organization",
        name: "Praxia Labs",
        url: BASE_URL,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Evaluación técnica de hardware y estudio de viabilidad on-premise",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/ia-privada-local#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.pregunta,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.respuesta,
        },
      })),
    },
  ],
};

export default function IaPrivadaLocalPage() {
  return (
    <div className="min-h-screen bg-[#070714] text-[#f5f5f7] pt-24 pb-20 selection:bg-purple-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-300 transition-colors">
            Praxia Labs
          </Link>
          <span className="text-slate-600">/</span>
          <span>Arquitectura</span>
          <span className="text-slate-600">/</span>
          <span className="text-white">IA Privada On-Premise</span>
        </div>

        {/* Hero */}
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono mb-6">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            SOBERANÍA DE DATOS &middot; LOCAL GALAXY AIRGAP
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-balance">
            Tus datos confidenciales{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
              nunca deben salir de tus propios servidores.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8 border-l-2 border-purple-500/40 pl-5">
            Despliega modelos de lenguaje, visión y RAG privado en tu propio hardware. Cero fuga de información hacia nubes públicas, cumplimiento estricto del secreto empresarial y protección total bajo el RGPD.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contacto?asunto=ia-privada-local"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
            >
              Consultar viabilidad de servidor propio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#arquitectura"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-purple-500/40 font-semibold text-sm transition-all"
            >
              Cómo funciona AirGap
            </a>
          </div>
        </header>

        {/* Why On-Premise Matters */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            El riesgo invisible de usar APIs públicas de IA en la empresa
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl">
            Cuando un empleado pega un balance, una patente o una lista de clientes en herramientas en la nube, la soberanía se pierde.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
              <EyeOff className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Exposición de Secretos Comerciales</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Términos contractuales, márgenes de proveedores o algoritmos internos quedan almacenados en centros de datos fuera de tu jurisdicción.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
              <ShieldCheck className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Sanciones RGPD y Auditorías</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                El tratamiento de datos sensibles (salud, legal, fiscal) exige garantías absolutas de que no hay transferencia internacional ilícita.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
              <Server className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Costes Recurrentes Incontrolables</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pagar por token en la nube genera facturas imprevistas que se disparan en cuanto el volumen documental crece.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture Diagram Section */}
        <section id="arquitectura" className="mb-24">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Arquitectura Praxia AirGap &middot; Local Galaxy
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl text-sm">
              Un entorno cerrado donde la inferencia ocurre exclusivamente dentro de tu red corporativa.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-start gap-4">
                  <Database className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Base Vectorial RAG Local</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Tus manuales, contratos y datos se indexan localmente en memoria y almacenamiento cifrado.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-start gap-4">
                  <Cpu className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Motor de Inferencia Optimizado</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Modelos cuantizados de última generación con latencias inferiores a 50 ms por respuesta.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-start gap-4">
                  <Lock className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Aislamiento Total de Red (Zero Telemetry)</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Cero llamadas externas, sin telemetría ni comprobaciones hacia servidores fuera de tu empresa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-6 space-y-4">
                <div className="text-xs font-mono uppercase text-purple-400 tracking-wider">
                  Matriz de Garantías Soberanas
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">Conexión a Internet</span>
                    <span className="text-emerald-400 font-bold">DESCONECTADO / AIRGAP</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">Entrenamiento con tus datos</span>
                    <span className="text-emerald-400 font-bold">IMPOSIBLE (CERO FUGA)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">Propiedad Intelectual</span>
                    <span className="text-emerald-400 font-bold">100% DE TU EMPRESA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Preguntas Frecuentes</h2>
          <p className="text-slate-400 mb-8">
            Dudas técnicas y organizativas sobre el despliegue de IA local on-premise.
          </p>

          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-800 bg-slate-900/30">
                <h3 className="font-bold text-white text-base mb-2">{item.pregunta}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.respuesta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              ¿Quieres evaluar el despliegue en tu infraestructura?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              En una sesión técnica de 15 minutos, revisamos tus servidores o estación de trabajo y calculamos la capacidad para ejecutar tus modelos en local.
            </p>
            <div className="pt-4">
              <Link
                href="/contacto?asunto=evaluacion-airgap"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
              >
                Solicitar estudio de servidor local
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Evaluación sin coste &middot; Sin compromiso de compra &middot; Ingeniería española directa
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
