"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { evaluarNis2, NIS2_SECTORS, FUENTES_NIS2 } from "@/lib/nis2";

export function Nis2Calculator() {
  const [sectorId, setSectorId] = useState("energia");
  const [empleados, setEmpleados] = useState(80);
  const [facturacion, setFacturacion] = useState(15);
  const [enviado, setEnviado] = useState(false);

  const resultado = evaluarNis2({ sectorId, empleados, facturacionMEur: facturacion });

  return (
    <div
      id="calculadora"
      className="rounded-2xl border border-border bg-card backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-red-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Exposición NIS2
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground">
          Tres datos y sabes si la directiva te aplica.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">Sector</span>
          <select
            value={sectorId}
            onChange={(e) => { setSectorId(e.target.value); setEnviado(false); }}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
          >
            {NIS2_SECTORS.map((s) => (
              <option key={s.id} value={s.id} className="bg-background text-foreground">
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Empleados: <span className="font-bold text-red-400">{empleados}</span>
          </span>
          <input
            type="range" min={1} max={500} step={1} value={empleados}
            onChange={(e) => { setEmpleados(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Facturación anual: <span className="font-bold text-red-400">{facturacion} M€</span>
          </span>
          <input
            type="range" min={0} max={100} step={1} value={facturacion}
            onChange={(e) => { setFacturacion(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="rounded-xl p-4 border"
          style={{
            background: resultado.enAmbito ? "#dc262610" : "rgba(120,120,140,0.08)",
            borderColor: resultado.enAmbito ? "#dc262640" : "rgba(120,120,140,0.28)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              className={`h-4 w-4 ${resultado.enAmbito ? "text-red-400" : "text-muted-foreground"}`}
            />
            <span
              className={`text-xs uppercase tracking-widest font-bold ${
                resultado.enAmbito ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              {resultado.categoria === "esencial"
                ? "Entidad esencial"
                : resultado.categoria === "importante"
                ? "Entidad importante"
                : "Fuera del ámbito"}
            </span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {resultado.motivo}
          </p>

          {resultado.enAmbito && (
            <>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-black text-foreground">
                  {resultado.exposicionEur.toLocaleString("es-ES")} €
                </span>
                <span className="text-sm text-muted-foreground pb-1">exposición estimada</span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {resultado.obligaciones.map((o) => (
                  <li key={o} className="text-xs text-muted-foreground leading-relaxed">
                    · {o}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {resultado.enAmbito && !enviado && (
          <Link
            href={`/contacto?motivo=${encodeURIComponent("Informe NIS2")}&sector=${encodeURIComponent(sectorId)}`}
            onClick={() => setEnviado(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm text-white shimmer-btn transition-transform hover:scale-[1.02]"
          >
            Quiero el informe completo <ArrowRight className="h-4 w-4" />
          </Link>
        )}

        <div className="pt-4 border-t border-border space-y-1">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Estimación orientativa. España no ha transpuesto todavía la directiva: no hay plazo
            legal vigente que citar. Cuando se publique en el BOE, llegará de golpe.
          </p>
          {FUENTES_NIS2.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Fuente: {f.titulo}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
