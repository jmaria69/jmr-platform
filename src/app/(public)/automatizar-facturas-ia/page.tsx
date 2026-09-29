import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileSpreadsheet, Sparkles, Zap } from "lucide-react";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "Automatizar Facturas con IA para Empresas y Gestorías | Praxia Labs",
  description:
    "Extrae, clasifica y contabiliza facturas en PDF o imagen en menos de 3 segundos con 99.4% de precisión sin plantillas rígidas. Integrado con tu ERP y operativo en 48 horas.",
  keywords: [
    "automatizar facturas IA",
    "procesamiento facturas PDF",
    "OCR facturas con inteligencia artificial",
    "contabilidad automatizada pymes",
    "extracción de facturas ERP",
    "Praxia Labs facturas",
  ],
  alternates: {
    canonical: "/automatizar-facturas-ia",
    languages: { "x-default": "/automatizar-facturas-ia", es: "/automatizar-facturas-ia" },
  },
  openGraph: {
    title: "Automatización de Facturas con IA | Praxia Labs",
    description:
      "Elimina el tecleo manual de facturas. De PDF o ticket a tu ERP en 3 segundos con 99.4% de precisión.",
    url: `${BASE_URL}/automatizar-facturas-ia`,
    siteName: "Praxia Labs",
    locale: "es_ES",
    type: "website",
  },
};

const FAQS = [
  {
    pregunta: "¿Cómo extrae las facturas la IA si cada proveedor usa un diseño distinto?",
    respuesta:
      "A diferencia de los sistemas de plantillas tradicionales (OCR rígido), los agentes de Praxia Labs utilizan modelos multimodales que comprenden la semántica del documento. No importa dónde esté colocado el NIF, la tabla de conceptos o el desglose de IVA: el sistema lo identifica y valida con un 99.4% de precisión.",
  },
  {
    pregunta: "¿Se integra con nuestro software contable o ERP actual?",
    respuesta:
      "Sí. El agente se conecta directamente mediante API, exportación programada (CSV, JSON, Excel) o webhook con tu ERP actual (SAP, Holded, Sage, A3, FacturaE o bases de datos propias), sin requerir migraciones complejas.",
  },
  {
    pregunta: "¿Cuánto tiempo se tarda en dejar el sistema funcionando?",
    respuesta:
      "Tras un diagnóstico de 15 minutos, desplegamos un prototipo funcional con tus propias facturas reales en menos de 48 horas para que verifiques la fiabilidad antes de pasar a producción.",
  },
  {
    pregunta: "¿Cumple con la normativa de protección de datos (RGPD)?",
    respuesta:
      "Totalmente. Los datos se procesan bajo cifrado y estándares europeos de privacidad. Además, para empresas con requisitos estrictos de confidencialidad, ofrecemos el modo AirGap Local Galaxy para ejecutar los modelos 100% en servidores propios on-premise.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${BASE_URL}/automatizar-facturas-ia#service`,
      name: "Automatización de Facturas con Inteligencia Artificial",
      serviceType: "Procesamiento y Contabilización de Facturas",
      description:
        "Agente autónomo de visión multimodal y LLMs para extracción de facturas, validación de NIFs, desglose de bases y conciliación contable sin intervención manual.",
      provider: {
        "@type": "Organization",
        name: "Praxia Labs",
        url: BASE_URL,
      },
      areaServed: "ES",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Diagnóstico inicial de viabilidad y piloto en 48 horas",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/automatizar-facturas-ia#faq`,
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

export default function AutomatizarFacturasPage() {
  return (
    <div className="min-h-screen bg-[#070714] text-[#f5f5f7] pt-24 pb-20 selection:bg-cyan-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb & Tag */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-6">
          <Link href="/" className="hover:text-cyan-300 transition-colors">
            Praxia Labs
          </Link>
          <span className="text-slate-600">/</span>
          <span>Soluciones</span>
          <span className="text-slate-600">/</span>
          <span className="text-white">Facturación IA</span>
        </div>

        {/* Hero Section */}
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            OPERATIVO EN PRODUCCIÓN EN &lt; 48 HORAS
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-balance">
            Deja de picar facturas a mano.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Tu agente de IA las procesa en 3 segundos.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8 border-l-2 border-cyan-500/40 pl-5">
            Extrae emisor, NIF, líneas de desglose, bases imponibles e impuestos desde cualquier PDF o foto.
            Sin plantillas que se rompen al mínimo cambio y validado directamente contra tu programa de contabilidad o ERP.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contacto?asunto=facturas-ia"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
            >
              Reservar diagnóstico gratuito (15 min)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#comparativa"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-500/40 font-semibold text-sm transition-all"
            >
              Ver comparativa técnica
            </a>
          </div>
        </header>

        {/* Live Simulator Card */}
        <section className="mb-24">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                  Simulación de Extracción en Tiempo Real &middot; Core-Ops Invoices
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-md border border-cyan-800/50">
                Precisión media: 99.4%
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>DOCUMENTO ENTRANTE</span>
                  <span className="text-amber-400">PDF / Ticket</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
                  <div className="text-slate-300 font-bold">FACTURA Nº: INV-2026-8891</div>
                  <div>Proveedor: Soluciones Logísticas Globales S.L.</div>
                  <div>NIF: B-88492019</div>
                  <div className="border-t border-slate-800 pt-1 mt-2 text-slate-500">
                    Línea 1: Servicios Transporte Paletizado ... 1.250,00 €
                  </div>
                  <div className="text-slate-500">Línea 2: Tasa manipulación aduanera ... 180,00 €</div>
                  <div className="border-t border-slate-800 pt-1 font-semibold text-slate-200">
                    Base: 1.430,00 € &middot; IVA (21%): 300,30 € &middot; Total: 1.730,30 €
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Salida Estructurada para tu ERP (3 seg)
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono">
                    <span className="text-slate-300">Validación NIF VIES / AEAT</span>
                    <span className="text-emerald-400 font-bold">VÁLIDO ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono">
                    <span className="text-slate-300">Cuadre Matemático Bases e IVA</span>
                    <span className="text-cyan-400 font-bold">EXACTO (0 err)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs font-mono">
                    <span className="text-slate-300">Asiento Contable Generado</span>
                    <span className="text-blue-400 font-bold">SINCRONIZADO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            El fin de los cuellos de botella en administración
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl">
            Tus profesionales deben dedicar su jornada a tomar decisiones y negociar, no a transcribir datos de una pantalla a otra.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
              <Clock className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Recupera 20+ horas al mes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Elimina las jornadas dedicadas a teclear datos contables a final de mes o en cierres trimestrales.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Cero errores de transcripción</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                El agente realiza comprobación cruzada de NIFs, sumatorios y tipos impositivos antes de volcar nada.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
              <FileSpreadsheet className="w-8 h-8 text-sky-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Conectado a lo que ya usas</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compatible con Holded, Sage, SAP, A3, facturación electrónica FacturaE o cualquier ERP con API o CSV.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="comparativa" className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Comparativa: ¿Por qué la IA de Praxia frente al OCR tradicional?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Los OCRs de hace 10 años dependían de coordenadas fijas en el papel. Nuestra visión multimodal entiende el documento como lo haría un analista humano.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono uppercase text-slate-400 bg-slate-900/50">
                  <th className="p-4 sm:p-5">Criterio</th>
                  <th className="p-4 sm:p-5 text-cyan-400 bg-cyan-950/20 font-bold border-x border-cyan-800/40">
                    Praxia Labs (Core-Ops IA)
                  </th>
                  <th className="p-4 sm:p-5">OCR Rígido Tradicional</th>
                  <th className="p-4 sm:p-5">Entrada Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Cambio de diseño del proveedor</td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-medium bg-cyan-950/10 border-x border-cyan-800/40">
                    Se adapta automáticamente sin reconfigurar
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Falla o extrae datos en blanco</td>
                  <td className="p-4 sm:p-5 text-slate-400">Requiere releer todo el documento</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Tiempo de procesamiento</td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-medium bg-cyan-950/10 border-x border-cyan-800/40">
                    &lt; 3 segundos por factura
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">10 a 30 segundos con fallos frecuentes</td>
                  <td className="p-4 sm:p-5 text-slate-400">3 a 8 minutos por factura</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Validación de NIFs y Cuadre</td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-medium bg-cyan-950/10 border-x border-cyan-800/40">
                    Automático con aviso de discrepancia
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Solo extrae texto sin verificar lógica</td>
                  <td className="p-4 sm:p-5 text-slate-400">Sujeto a despistes y fatiga humana</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Tiempo de puesta en marcha</td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-medium bg-cyan-950/10 border-x border-cyan-800/40">
                    Operativo en &lt; 48 horas
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Semanas de mapeo de plantillas</td>
                  <td className="p-4 sm:p-5 text-slate-400">Inmediato pero con coste continuo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Preguntas Frecuentes</h2>
          <p className="text-slate-400 mb-8">
            Respuestas directas a las dudas habituales de directores financieros y departamentos contables.
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

        {/* Final CTA Card */}
        <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900/80 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              ¿Quieres ver cómo procesa tus propias facturas?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              En una llamada de 15 minutos sin compromiso, cargamos ejemplos reales de tus proveedores y compruebas la extracción en vivo.
            </p>
            <div className="pt-4">
              <Link
                href="/contacto?asunto=demo-facturas"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
              >
                Solicitar demostración con mis facturas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Sin tarjeta de crédito &middot; Sin compromiso de compra &middot; Respuesta en &lt; 2 horas
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
