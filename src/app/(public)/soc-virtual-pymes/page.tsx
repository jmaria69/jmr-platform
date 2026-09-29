import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2, Shield, ShieldCheck, Terminal, Zap } from "lucide-react";
import { Nis2Calculator } from "@/components/public/nis2-calculator";

const BASE_URL = "https://praxialabs.com";

export const metadata: Metadata = {
  title: "SOC Virtual y Ciberseguridad Activa para PYMEs | SIAM Praxia Labs",
  description:
    "Protege tu empresa 24/7 con SIAM. Cortafuegos WAF perimetral, señuelos Honeypot inteligentes y correlación forense MITRE ATT&CK. Adaptado a la directiva NIS2.",
  keywords: [
    "SOC virtual pymes",
    "ciberseguridad gestionada España",
    "SIAM ciberseguridad",
    "detección de intrusiones pymes",
    "cumplimiento NIS2 empresas",
    "honeypot WAF pymes",
  ],
  alternates: {
    canonical: "/soc-virtual-pymes",
    languages: { "x-default": "/soc-virtual-pymes", es: "/soc-virtual-pymes" },
  },
  openGraph: {
    title: "SOC Virtual con IA para PYMEs | SIAM Praxia Labs",
    description:
      "Monitorización 24/7, bloqueo perimetral en milisegundos y trampas Honeypot. Ciberseguridad empresarial a tu alcance.",
    url: `${BASE_URL}/soc-virtual-pymes`,
    siteName: "Praxia Labs",
    locale: "es_ES",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${BASE_URL}/soc-virtual-pymes#service`,
      name: "SOC Virtual y Ciberseguridad Activa SIAM",
      serviceType: "Centro de Operaciones de Seguridad (SOC) 24/7",
      description:
        "Plataforma integral de ciberseguridad para pequeñas y medianas empresas: monitorización activa, cortafuegos WAF, señuelos Honeypot y análisis forense automatizado.",
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
        description: "Diagnóstico inicial de ciberseguridad y demo activa en directo",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/soc-virtual-pymes#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Por qué un antivirus o EDR tradicional ya no es suficiente para una PYME?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Los antivirus tradicionales solo actúan cuando el malware ya ha entrado y se ejecuta en un equipo local. SIAM actúa en el perímetro externo: bloquea escaneos de puertos y ataques web (WAF) en milisegundos, e interroga al atacante mediante señuelos Honeypot antes de que toque tus bases de datos o red corporativa.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo ayuda SIAM a cumplir con la directiva europea NIS2?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NIS2 exige a las empresas registrar, auditar y notificar incidentes de seguridad significativos en un plazo de 24 horas. SIAM genera informes forenses automáticos alineados con la matriz MITRE ATT&CK, detallando qué ocurrió, qué IPs atacaron y qué medidas de mitigación se aplicaron.",
          },
        },
        {
          "@type": "Question",
          name: "¿Requiere instalar hardware costoso en nuestra oficina?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. SIAM se integra como un proxy perimetral y sensores ligeros en tu infraestructura cloud o servidores actuales sin interrumpir el servicio ni requerir equipamiento físico dedicado.",
          },
        },
      ],
    },
  ],
};

export default function SocVirtualPymesPage() {
  return (
    <div className="min-h-screen bg-[#070714] text-[#f5f5f7] pt-24 pb-20 selection:bg-rose-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-rose-400 mb-6">
          <Link href="/" className="hover:text-rose-300 transition-colors">
            Praxia Labs
          </Link>
          <span className="text-slate-600">/</span>
          <span>Ciberseguridad</span>
          <span className="text-slate-600">/</span>
          <span className="text-white">SOC Virtual PYMEs</span>
        </div>

        {/* Hero Section */}
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono mb-6">
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            PROTECCIÓN ACTIVA 24/7 &middot; SIAM
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-balance">
            El 70% de los ciberataques caen sobre PYMEs.{" "}
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Tu empresa no puede permitirse estar a ciegas.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8 border-l-2 border-rose-500/40 pl-5">
            SIAM te proporciona un SOC virtual inteligente: bloqueo perimetral en milisegundos, señuelos Honeypot para neutralizar atacantes y cumplimiento estricto de la directiva NIS2 sin el coste de un equipo interno.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contacto?asunto=diagnostico-siam"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all"
            >
              Solicitar diagnóstico de ciberseguridad
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#calculadora-nis2"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-rose-500/40 font-semibold text-sm transition-all"
            >
              Comprobar mi riesgo NIS2
            </a>
          </div>
        </header>

        {/* Real Stats Box (INCIBE Data) */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20">
              <div className="text-4xl font-extrabold text-rose-400 font-mono mb-2">70%</div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                Objetivo PYMEs en España
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Los ciberdelincuentes no atacan el IBEX 35 por diversión: automatizan escaneos masivos sobre empresas medianas con defensas débiles.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20">
              <div className="text-4xl font-extrabold text-amber-400 font-mono mb-2">75.000 €</div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                Coste Medio de un Incidente
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pérdida de facturación por parada operativa, rescates, recuperación de copias y sanciones regulatorias por fuga de datos.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-orange-500/30 bg-orange-950/20">
              <div className="text-4xl font-extrabold text-orange-400 font-mono mb-2">24 Horas</div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                Plazo Obligatorio NIS2
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                La directiva europea sanciona a los administradores que no dispongan de trazabilidad exacta para notificar brechas en el primer día.
              </p>
            </div>
          </div>
        </section>

        {/* Triple Defense Architecture */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">La Arquitectura de Defensa SIAM</h2>
          <p className="text-slate-400 mb-10 max-w-2xl">
            Tres capas coordinadas para asegurar que ninguna amenaza pase desapercibida ni alcance tus servidores centrales.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">WAF Perimetral en Milisegundos</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Detecta y corta en el acto inyecciones SQL, escaneos de rutas sensibles (`.env`, `wp-login`) y ataques de fuerza bruta antes de tocar tu aplicación.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Honeypots Señuelo Inteligentes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Trampas activas que simulan paneles de acceso vulnerables. Cuando un atacante intenta interactuar, capturamos su IP, User-Agent y tácticas sin riesgo.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reconstrucción MITRE ATT&CK</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Correlaciona eventos del WAF y del Honeypot en una narrativa forense con matriz MITRE para entender la intención real y recomendar contención inmediata.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Comparativa: ¿Por qué SIAM frente a un MSSP tradicional o un antivirus simple?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            La mayoría de PYMEs están atrapadas entre antivirus que no frenan intrusiones perimetrales o servicios de consultoría con tarifas desproporcionadas.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono uppercase text-slate-400 bg-slate-900/50">
                  <th className="p-4 sm:p-5">Capacidad</th>
                  <th className="p-4 sm:p-5 text-rose-400 bg-rose-950/20 font-bold border-x border-rose-800/40">
                    SIAM (Praxia Labs)
                  </th>
                  <th className="p-4 sm:p-5">MSSP / SOC Clásico</th>
                  <th className="p-4 sm:p-5">Antivirus / EDR Estándar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Defensa perimetral y señuelos</td>
                  <td className="p-4 sm:p-5 text-rose-300 font-medium bg-rose-950/10 border-x border-rose-800/40">
                    WAF + Honeypots de alta interacción incluidos
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Módulo adicional con sobrecoste alto</td>
                  <td className="p-4 sm:p-5 text-slate-400">Inexistente (solo mira el endpoint)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Tiempo de respuesta y contención</td>
                  <td className="p-4 sm:p-5 text-rose-300 font-medium bg-rose-950/10 border-x border-rose-800/40">
                    Bloqueo instantáneo automatizado &lt; 50 ms
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Depende de guardia de analista humano</td>
                  <td className="p-4 sm:p-5 text-slate-400">Solo tras la ejecución del binario</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Adaptado a PYMEs y costes</td>
                  <td className="p-4 sm:p-5 text-rose-300 font-medium bg-rose-950/10 border-x border-rose-800/40">
                    Tarifa plana transparente sin permanencia
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Contratos anuales desde 2.000€/mes</td>
                  <td className="p-4 sm:p-5 text-slate-400">Económico pero con huecos críticos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* NIS2 Calculator Section */}
        <section id="calculadora-nis2" className="mb-24 rounded-2xl border border-slate-800 bg-slate-900/30 p-8 sm:p-10">
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Calculadora de Exposición a NIS2</h2>
            <p className="text-slate-400 text-sm">
              La directiva NIS2 no distingue por lo preparado que estés, sino por tu sector de actividad y número de empleados.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Nis2Calculator />
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/40 via-slate-900/80 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              ¿Quieres ver cómo SIAM repele ataques reales en directo?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Te mostramos el dashboard SOC en funcionamiento con los señuelos y el registro de amenazas bloqueadas en las últimas 24 horas.
            </p>
            <div className="pt-4">
              <Link
                href="/contacto?asunto=demo-siam"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all"
              >
                Reservar demo activa del SOC virtual
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Diagnóstico de 15 minutos &middot; Sin compromiso &middot; Contacto directo con ingenieros
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
