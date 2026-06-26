"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ArrowDown, Zap } from "lucide-react";

// Real automation scenarios from Praxia Labs clients
const SCENARIOS = [
  {
    tag: "Gestion de facturas",
    input: "Factura recibida por email (PDF)",
    agent: "VERA analiza, clasifica y valida",
    output: "Aprobada + registrada en ERP",
    saving: "2.4h/factura ahorradas",
    color: "#7c3aed",
  },
  {
    tag: "Atencion al cliente",
    input: "Email de cliente con incidencia",
    agent: "OLGA categoriza y redacta respuesta",
    output: "Respondido + ticket creado",
    saving: "40 min por incidencia",
    color: "#00d4ff",
  },
  {
    tag: "Operaciones IT",
    input: "Reunion de equipo finalizada",
    agent: "Core OPS extrae acuerdos y tareas",
    output: "Acta generada + tareas asignadas",
    saving: "90 min de trabajo manual",
    color: "#06ffa5",
  },
];

type Phase = "input" | "processing" | "output" | "done";

const PHASE_DURATIONS: Record<Phase, number> = {
  input:      1200,
  processing: 1800,
  output:     1000,
  done:       2500,
};

export function AgentFlowWidget() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("input");
  const [processingDots, setProcessingDots] = useState(0);

  const scenario = SCENARIOS[scenarioIndex];

  // Advance through phases
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === "input")      setPhase("processing");
      else if (phase === "processing") setPhase("output");
      else if (phase === "output") setPhase("done");
      else {
        // Reset to next scenario
        setPhase("input");
        setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
      }
    }, PHASE_DURATIONS[phase]);

    return () => clearTimeout(timer);
  }, [phase, scenarioIndex]);

  // Animated processing dots
  useEffect(() => {
    if (phase !== "processing") return;
    const iv = setInterval(() => setProcessingDots((d) => (d + 1) % 4), 450);
    return () => clearInterval(iv);
  }, [phase]);

  const isProcessing = phase === "processing";
  const showOutput   = phase === "output" || phase === "done";

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(13, 13, 43, 0.85)",
        border: `1px solid ${scenario.color}30`,
        boxShadow: `0 0 40px ${scenario.color}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: "border-color 0.6s ease, box-shadow 0.6s ease",
      }}
      aria-label="Demostracion de automatizacion de Praxia Labs"
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: `${scenario.color}20`, background: `${scenario.color}08` }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" style={{ color: scenario.color }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: scenario.color }}>
            {scenario.tag}
          </span>
        </div>
        {/* Traffic lights decoration */}
        <div className="flex gap-1.5">
          {[0.4, 0.6, 0.8].map((op, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: scenario.color, opacity: op }}
            />
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Step 1 — Input */}
        <Step
          label="Entrada"
          text={scenario.input}
          visible
          done={!isProcessing || phase !== "input"}
          accent="#8888aa"
        />

        {/* Connector */}
        <div className="flex flex-col items-center gap-1 py-1">
          <ArrowDown className="h-4 w-4" style={{ color: scenario.color, opacity: 0.7 }} />
        </div>

        {/* Step 2 — Agent */}
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: `${scenario.color}10`,
            border: `1px solid ${scenario.color}30`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: scenario.color }} />
            ) : showOutput ? (
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: scenario.color }} />
            ) : (
              <div className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: scenario.color }} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: scenario.color }}>
              Agente IA
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: "#e8e8f0" }}>
            {scenario.agent}
            {isProcessing && (
              <span className="ml-1" style={{ color: scenario.color }}>
                {"...".slice(0, processingDots + 1)}
              </span>
            )}
          </p>

          {/* Progress bar during processing */}
          {isProcessing && (
            <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: `${scenario.color}20` }}>
              <div
                className="h-full rounded-full"
                style={{
                  background: scenario.color,
                  animation: `flow-progress ${PHASE_DURATIONS.processing}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>

        {/* Connector */}
        <div className="flex flex-col items-center gap-1 py-1">
          <ArrowDown
            className="h-4 w-4 transition-opacity duration-500"
            style={{ color: scenario.color, opacity: showOutput ? 0.9 : 0.25 }}
          />
        </div>

        {/* Step 3 — Output */}
        <div
          className="rounded-xl px-4 py-3 transition-all duration-500"
          style={{
            background: showOutput ? "rgba(6, 255, 165, 0.06)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${showOutput ? "rgba(6,255,165,0.25)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="h-4 w-4 transition-all duration-300"
              style={{
                color: showOutput ? "#06ffa5" : "#8888aa",
                opacity: showOutput ? 1 : 0.3,
              }}
            />
            <p
              className="text-sm font-semibold transition-all duration-300"
              style={{ color: showOutput ? "#e8e8f0" : "#555577" }}
            >
              {showOutput ? scenario.output : "Esperando resultado..."}
            </p>
          </div>
        </div>

        {/* Savings badge */}
        <div
          className="flex items-center justify-between mt-3 pt-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Tiempo ahorrado</span>
          <span
            className="text-sm font-bold transition-all duration-300"
            style={{ color: showOutput ? "#06ffa5" : "#444460" }}
          >
            {showOutput ? scenario.saving : "calculando..."}
          </span>
        </div>
      </div>

      {/* Scenario indicator dots */}
      <div className="flex justify-center gap-1.5 pb-4">
        {SCENARIOS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === scenarioIndex ? "20px" : "6px",
              background: i === scenarioIndex ? scenario.color : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step row ───
function Step({
  label,
  text,
  visible,
  done,
  accent,
}: {
  label: string;
  text: string;
  visible: boolean;
  done: boolean;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.06)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: accent }}>
        {label}
      </span>
      <p className="text-sm font-medium text-[#e8e8f0] mt-0.5">{text}</p>
    </div>
  );
}
