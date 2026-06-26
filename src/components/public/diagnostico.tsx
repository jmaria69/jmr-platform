"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Clock, Bot } from "lucide-react";

// ── Opciones ──
const SECTORES = [
  { id: "salud",        label: "Salud / Clínicas" },
  { id: "inmobiliaria", label: "Inmobiliaria" },
  { id: "it",           label: "Tecnología / IT" },
  { id: "legal",        label: "Legal / Asesoría" },
  { id: "retail",       label: "Retail / E-commerce" },
  { id: "otro",         label: "Otro sector" },
];

const PROCESOS = [
  { id: "facturas",  label: "Facturación / Contabilidad", horas: 24, agente: "VERA",    color: "#7c3aed" },
  { id: "email",     label: "Atención al cliente",        horas: 40, agente: "OLGA",    color: "#00d4ff" },
  { id: "informes",  label: "Informes / Reporting",       horas: 32, agente: "Core OPS", color: "#06b6d4" },
  { id: "rrhh",      label: "RRHH / Onboarding",         horas: 20, agente: "VERA",    color: "#7c3aed" },
  { id: "citas",     label: "Gestión de citas",           horas: 16, agente: "SaludApp", color: "#06b6d4" },
  { id: "seguridad", label: "Seguridad / Alertas",        horas: 28, agente: "SIAM",    color: "#dc2626" },
  { id: "otro",      label: "Otro proceso",               horas: 20, agente: "OLGA",    color: "#00d4ff" },
];

const EQUIPOS = [
  { id: "micro",  label: "1 – 5 personas",   mult: 1.0 },
  { id: "small",  label: "5 – 20 personas",  mult: 1.6 },
  { id: "medium", label: "20 – 100 personas", mult: 2.8 },
  { id: "large",  label: "+ 100 personas",   mult: 4.5 },
];

type StepId = 1 | 2 | 3 | "result";

export function DiagnosticoWidget() {
  const [step, setStep] = useState<StepId>(1);
  const [sector, setSector]   = useState<string | null>(null);
  const [proceso, setProceso] = useState<string | null>(null);
  const [equipo, setEquipo]   = useState<string | null>(null);

  const selectedProceso = PROCESOS.find(p => p.id === proceso);
  const selectedEquipo  = EQUIPOS.find(e => e.id === equipo);

  const horasMes   = selectedProceso && selectedEquipo
    ? Math.round(selectedProceso.horas * selectedEquipo.mult)
    : 0;
  const ahorroMes  = Math.round(horasMes * 35); // €35/h media empleado en España

  function reset() {
    setStep(1); setSector(null); setProceso(null); setEquipo(null);
  }

  return (
    <div className="relative rounded-2xl border border-purple-500/25 bg-[#0d0d2b]/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Diagnóstico en vivo</span>
        </div>
        <p className="text-white font-semibold text-sm">
          3 preguntas → resultado personalizado en segundos
        </p>
      </div>

      {/* Progress bar */}
      {step !== "result" && (
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${(Number(step) / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="p-6">

        {/* ── PASO 1: Sector ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 font-medium">¿En qué sector opera tu empresa?</p>
            <div className="grid grid-cols-2 gap-2">
              {SECTORES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSector(s.id); setStep(2); }}
                  className="px-3 py-2.5 rounded-lg text-sm text-left font-medium border transition-all
                    border-white/10 text-gray-300 hover:border-purple-500/60 hover:text-white hover:bg-purple-500/10"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PASO 2: Proceso ── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 font-medium">¿Qué proceso haces a mano hoy?</p>
            <div className="grid grid-cols-1 gap-2">
              {PROCESOS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setProceso(p.id); setStep(3); }}
                  className="px-3 py-2.5 rounded-lg text-sm text-left font-medium border transition-all
                    border-white/10 text-gray-300 hover:border-cyan-500/60 hover:text-white hover:bg-cyan-500/8"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-gray-600 hover:text-gray-400 transition">← Volver</button>
          </div>
        )}

        {/* ── PASO 3: Equipo ── */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 font-medium">¿Cuántas personas hay en tu equipo?</p>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPOS.map(e => (
                <button
                  key={e.id}
                  onClick={() => { setEquipo(e.id); setStep("result"); }}
                  className="px-3 py-2.5 rounded-lg text-sm text-left font-medium border transition-all
                    border-white/10 text-gray-300 hover:border-purple-500/60 hover:text-white hover:bg-purple-500/10"
                >
                  {e.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="text-xs text-gray-600 hover:text-gray-400 transition">← Volver</button>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {step === "result" && selectedProceso && selectedEquipo && (
          <div className="space-y-5">
            {/* Headline result */}
            <div
              className="rounded-xl p-4 border"
              style={{
                background: `${selectedProceso.color}10`,
                borderColor: `${selectedProceso.color}30`,
              }}
            >
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: selectedProceso.color }}>
                Resultado del diagnóstico
              </p>
              <div className="flex items-end gap-3 mb-1">
                <span className="font-display text-4xl font-black text-white">{horasMes}h</span>
                <span className="text-gray-400 text-sm pb-1">ahorradas / mes</span>
              </div>
              <p className="text-gray-400 text-xs">
                Equivale a{" "}
                <span className="text-white font-semibold">~{ahorroMes.toLocaleString("es-ES")}€/mes</span>
                {" "}en coste de trabajo manual.
              </p>
            </div>

            {/* Agent match */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/8">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                style={{ background: `${selectedProceso.color}20`, color: selectedProceso.color }}
              >
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Agente recomendado:{" "}
                  <span style={{ color: selectedProceso.color }}>{selectedProceso.agente}</span>
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Automatiza tu proceso de {selectedProceso.label.toLowerCase()} sin intervención humana.
                </p>
              </div>
            </div>

            {/* What's included */}
            <div className="space-y-1.5">
              {[
                "Análisis gratuito de tu proceso actual",
                "Demo en vivo con tus datos reales",
                "Propuesta operativa en 48h",
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/contacto?proceso=${encodeURIComponent(selectedProceso.label)}&agente=${encodeURIComponent(selectedProceso.agente)}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm text-white shimmer-btn transition-transform hover:scale-[1.02]"
            >
              Ver {selectedProceso.agente} en acción <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">Sin compromiso · Respuesta en &lt;2h</p>
              <button onClick={reset} className="text-xs text-gray-600 hover:text-gray-400 transition">
                Reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
