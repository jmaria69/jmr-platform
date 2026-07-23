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
      className="rounded-2xl border border-red-500/25 bg-white dark:bg-[#0d0d2b]/80 backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-red-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Exposición NIS2
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Tres datos y sabes si la directiva te aplica.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sector</span>
          <select
            value={sectorId}
            onChange={(e) => { setSectorId(e.target.value); setEnviado(false); }}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-900 dark:text-white"
          >
            {NIS2_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Empleados: <span className="font-bold text-red-400">{empleados}</span>
          </span>
          <input
            type="range" min={1} max={500} step={1} value={empleados}
            onChange={(e) => { setEmpleados(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Facturación anual: <span className="font-bold text-red-400">{facturacion} M€</span>
          </span>
          <input
            type="range" min={0} max={100} step={1} value={facturacion}
            onChange={(e) => { setFacturacion(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <div
          className="rounded-xl p-4 border"
          style={{
            background: resultado.enAmbito ? "#dc262610" : "#6b728010",
            borderColor: resultado.enAmbito ? "#dc262640" : "#6b728040",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: resultado.enAmbito ? "#dc2626" : "#6b7280" }}
            />
            <span
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: resultado.enAmbito ? "#dc2626" : "#6b7280" }}
            >
              {resultado.categoria === "esencial"
                ? "Entidad esencial"
                : resultado.categoria === "importante"
                ? "Entidad importante"
                : "Fuera del ámbito"}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {resultado.motivo}
          </p>

          {resultado.enAmbito && (
            <>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-black text-gray-900 dark:text-white">
                  {resultado.exposicionEur.toLocaleString("es-ES")} €
                </span>
                <span className="text-sm text-gray-500 pb-1">exposición estimada</span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {resultado.obligaciones.map((o) => (
                  <li key={o} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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

        <div className="pt-4 border-t border-white/5 space-y-1">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Estimación orientativa. España no ha transpuesto todavía la directiva: no hay plazo
            legal vigente que citar. Cuando se publique en el BOE, llegará de golpe.
          </p>
          {FUENTES_NIS2.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-gray-600 hover:text-gray-400 underline underline-offset-2"
            >
              Fuente: {f.titulo}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
