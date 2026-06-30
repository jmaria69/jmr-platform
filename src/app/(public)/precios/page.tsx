"use client";

import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, Zap, ArrowRight, MessageSquare } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Precios",
//   description: "Planes de automatizacion con IA para empresas. Desde 950€/mes. Sin permanencia mínima.",
// };

const PLANES = [
  {
    id: "esencial",
    name: "Esencial",
    price: 950,
    desc: "Para empresas que quieren automatizar un primer proceso crítico y ver resultados reales.",
    color: "#7c3aed",
    highlight: false,
    features: [
      "1 agente IA personalizado",
      "1 proceso automatizado",
      "Integraciones con email / Google Workspace",
      "Panel de monitoreo básico",
      "Soporte por email (respuesta < 24h)",
      "Onboarding guiado incluido",
      "Actualizaciones de mantenimiento",
    ],
    cta: "Empezar con Esencial",
    ideal: "Ideal para: autónomos y pymes de 1-10 personas",
  },
  {
    id: "profesional",
    name: "Profesional",
    price: 1800,
    desc: "Para equipos que quieren escalar la automatización a varios departamentos.",
    color: "#00d4ff",
    highlight: true,
    features: [
      "Hasta 3 agentes IA",
      "Hasta 3 procesos automatizados",
      "Integraciones avanzadas (ERP, CRM, APIs custom)",
      "Dashboard en tiempo real",
      "Soporte prioritario < 2h",
      "Revisión mensual de rendimiento",
      "Propuestas de mejora proactivas",
      "Acceso anticipado a nuevos agentes",
    ],
    cta: "Empezar con Profesional",
    ideal: "Ideal para: empresas de 10-50 personas",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 3200,
    desc: "Para organizaciones que necesitan una infraestructura completa de automatización.",
    color: "#06ffa5",
    highlight: false,
    features: [
      "Agentes ilimitados",
      "Procesos ilimitados",
      "Integraciones enterprise (SAP, Oracle, custom)",
      "Multi-tenant con aislamiento de datos",
      "Soporte 24/7 con SLA garantizado",
      "CTO Virtual mensual incluido",
      "Formación del equipo interno",
      "Auditoría de seguridad trimestral",
      "Despliegue on-premise disponible",
    ],
    cta: "Contactar para Enterprise",
    ideal: "Ideal para: empresas de +50 personas",
  },
];

const FAQS = [
  {
    q: "¿Hay permanencia mínima?",
    a: "No. Todos los planes son mes a mes. Puedes cancelar con 15 días de preaviso sin penalización.",
  },
  {
    q: "¿Qué pasa si necesito más de 3 agentes en el plan Profesional?",
    a: "Pasamos a Enterprise o diseñamos un plan a medida. Contáctanos y lo valoramos.",
  },
  {
    q: "¿El precio incluye el desarrollo inicial del agente?",
    a: "Sí. El onboarding, configuración y puesta en marcha del agente están incluidos en el primer mes.",
  },
  {
    q: "¿Qué sistemas pueden integrarse?",
    a: "Email, Google Workspace, CRMs (HubSpot, Salesforce), ERPs, Telegram, WhatsApp Business, APIs REST. Si usas algo diferente, pregúntanos.",
  },
  {
    q: "¿Los datos de mi empresa salen de nuestros sistemas?",
    a: "Nunca. Los agentes procesan los datos en tu entorno o en infraestructura aislada en la UE. Cumplimos RGPD.",
  },
];

export default function PreciosPage() {
  const [anual, setAnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function precio(base: number) {
    return anual ? Math.round(base * 0.8) : base;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent">

      {/* ── HEADER ── */}
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-purple-300">Sin permanencia · Sin código · Operativo en &lt;48h</span>
          </div>
          <h1 className="font-display text-5xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
            Precios claros,<br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              resultados medibles.
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-600 dark:text-gray-400 text-xl leading-relaxed">
            Cada plan incluye desarrollo, despliegue y soporte.
            No pagas por horas de consultoría — pagas por un agente que trabaja.
          </p>

          {/* Toggle anual/mensual */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-semibold transition ${!anual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}>Mensual</span>
            <button
              onClick={() => setAnual(a => !a)}
              className={`relative w-12 h-6 rounded-full transition-colors ${anual ? "bg-purple-600" : "bg-gray-200 dark:bg-white/15"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${anual ? "left-6.5" : "left-0.5"}`}
                style={{ left: anual ? "26px" : "2px" }}
              />
            </button>
            <span className={`text-sm font-semibold transition ${anual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}>
              Anual
              <span className="ml-2 text-xs text-green-400 font-bold">−20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANES.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                plan.highlight
                  ? "border-cyan-500/50 bg-white dark:bg-[#0d1a2b] shadow-[0_0_40px_rgba(0,212,255,0.12)]"
                  : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d0d2b]/60"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-gray-900 dark:text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Más popular
                  </span>
                </div>
              )}

              {/* Color top bar */}
              <div
                className="h-0.5 rounded-full mb-6"
                style={{ background: `linear-gradient(90deg, ${plan.color}, ${plan.color}40, transparent)` }}
              />

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: plan.color }}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="font-display text-5xl font-black text-gray-900 dark:text-white">
                    {precio(plan.price).toLocaleString("es-ES")}€
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-sm pb-2">/mes</span>
                </div>
                {anual && (
                  <p className="text-xs text-green-400 font-semibold mb-3">
                    Ahorras {((plan.price - precio(plan.price)) * 12).toLocaleString("es-ES")}€ al año
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-600 dark:text-gray-400 leading-relaxed">{plan.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Link
                  href={`/contacto?plan=${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={
                    plan.highlight
                      ? { background: "linear-gradient(135deg, #7c3aed, #00d4ff)", color: "white" }
                      : { border: `1.5px solid ${plan.color}40`, color: plan.color, background: `${plan.color}10` }
                  }
                >
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-center text-xs text-gray-500 dark:text-gray-600">{plan.ideal}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nota PYME + Kit Digital */}
        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3">
          <Zap className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-green-400">Kit Digital disponible.</span>{" "}
            Si tu empresa tiene entre 0 y 49 empleados, puedes financiar la implantación de agentes IA con el bono del Kit Digital (hasta 12.000€). Pregúntanos cómo tramitarlo sin burocracia.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-white/8 bg-gray-100 dark:bg-white/3 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-300 transition"
                >
                  {faq.q}
                  <span className={`text-lg text-gray-500 dark:text-gray-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-6 border-t border-purple-500/15">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¿No sabes qué plan necesitas?
          </h2>
          <p className="text-gray-500 dark:text-gray-600 dark:text-gray-400 mb-8">
            En 15 minutos te decimos qué proceso automatizar primero, qué agente le aplica y cuánto ahorrarías. Sin compromiso.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl shimmer-btn font-semibold text-gray-900 dark:text-white transition-transform hover:scale-105"
          >
            <MessageSquare className="h-5 w-5" />
            Reservar diagnóstico gratuito
          </Link>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-600">Respuesta en menos de 2 horas · Sin tarjeta</p>
        </div>
      </section>

    </div>
  );
}
