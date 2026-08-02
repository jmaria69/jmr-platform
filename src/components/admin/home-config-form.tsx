"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Cfg = {
  accent: string; accentBlue: string; effectsEnabled: boolean;
  bolt: string; thickness: number; length: number; sparkDensity: number;
  sparkColors: string[]; starfield: boolean;
  hero: { tagline: string; h1: string; h1em: string; lede: string };
  sections: { problema: boolean; servicios: boolean; como: boolean; productos: boolean; contacto: boolean };
  sectionOrder: string[];
};

const BOLTS = [
  { id: "azul", label: "Azul eléctrico" }, { id: "fuego", label: "Cian + Fuego" },
  { id: "lima", label: "Verde-lima" }, { id: "oro", label: "Dorado" },
  { id: "magenta", label: "Magenta" }, { id: "hielo", label: "Hielo" },
];
const SECTIONS: [keyof Cfg["sections"], string][] = [
  ["problema", "Problema (¿Te suena?)"], ["servicios", "Servicios"],
  ["como", "Por qué nosotros"], ["productos", "Casos reales"], ["contacto", "Contacto final"],
];

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-cyan-400" />
      {children}
    </label>
  );
}

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm"><Label>{label}</Label><span className="font-mono text-muted-foreground">{fmt ? fmt(value) : value}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-cyan-400" />
    </div>
  );
}

export function HomeConfigForm() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/home-config")
      .then((r) => r.json())
      .then((j) => setCfg(j.data))
      .catch(() => setStatus("error"));
  }, []);

  if (!cfg) return <p className="text-muted-foreground">Cargando configuración…</p>;

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setCfg((prev) => (prev ? { ...prev, [k]: v } : prev));
  const setHero = (k: keyof Cfg["hero"], v: string) =>
    setCfg((prev) => (prev ? { ...prev, hero: { ...prev.hero, [k]: v } } : prev));
  const setSec = (k: keyof Cfg["sections"], v: boolean) =>
    setCfg((prev) => (prev ? { ...prev, sections: { ...prev.sections, [k]: v } } : prev));
  const setSpark = (i: number, v: string) =>
    setCfg((prev) => {
      if (!prev) return prev;
      const s = [...prev.sparkColors];
      s[i] = v;
      return { ...prev, sparkColors: s };
    });
  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setCfg((prev) => {
      if (!prev) return prev;
      const o = [...prev.sectionOrder];
      const [m] = o.splice(from, 1);
      o.splice(to, 0, m);
      return { ...prev, sectionOrder: o };
    });
  };
  const labelOf = (k: string) => SECTIONS.find(([kk]) => kk === k)?.[1] ?? k;

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/home-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg) });
      if (!res.ok) throw new Error();
      const j = await res.json();
      setCfg(j.data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Colores del sitio</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.accent} onChange={(e) => set("accent", e.target.value)} className="h-9 w-12 rounded cursor-pointer bg-transparent" />
              <div><Label>Acento cian</Label><p className="text-xs text-muted-foreground font-mono">{cfg.accent}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.accentBlue} onChange={(e) => set("accentBlue", e.target.value)} className="h-9 w-12 rounded cursor-pointer bg-transparent" />
              <div><Label>Azul del degradado</Label><p className="text-xs text-muted-foreground font-mono">{cfg.accentBlue}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Efectos / fondo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Toggle checked={cfg.effectsEnabled} onChange={(v) => set("effectsEnabled", v)}>Cursor-rayo activado</Toggle>
            <Toggle checked={cfg.starfield} onChange={(v) => set("starfield", v)}>Constelación viva del hero</Toggle>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Cursor-rayo</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Color del rayo</Label>
              <select value={cfg.bolt} onChange={(e) => set("bolt", e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                {BOLTS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>
            <Slider label="Grosor" value={cfg.thickness} min={0.5} max={2} step={0.1} onChange={(v) => set("thickness", v)} fmt={(v) => `${v.toFixed(1)}×`} />
            <Slider label="Longitud de la estela" value={cfg.length} min={8} max={34} step={1} onChange={(v) => set("length", v)} fmt={(v) => `${v} pts`} />
            <Slider label="Densidad de chispas" value={cfg.sparkDensity} min={0} max={2} step={0.1} onChange={(v) => set("sparkDensity", v)} fmt={(v) => `${v.toFixed(1)}×`} />
          </div>
          <div>
            <Label>Colores de las partículas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {cfg.sparkColors.map((c, i) => (
                <input key={i} type="color" value={c} onChange={(e) => setSpark(i, e.target.value)} className="h-8 w-9 rounded cursor-pointer bg-transparent" title={c} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Textos del hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Tagline</Label><Input value={cfg.hero.tagline} onChange={(e) => setHero("tagline", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Titular</Label><Input value={cfg.hero.h1} onChange={(e) => setHero("h1", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Titular (parte en degradado)</Label><Input value={cfg.hero.h1em} onChange={(e) => setHero("h1em", e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Subtítulo</Label><Textarea rows={3} value={cfg.hero.lede} onChange={(e) => setHero("lede", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Secciones de la home</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Arrastra para reordenar. El interruptor muestra u oculta cada sección.</p>
          {cfg.sectionOrder.map((k, i) => (
            <div
              key={k}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null) reorder(dragIdx, i); setDragIdx(null); }}
              onDragEnd={() => setDragIdx(null)}
              className={`flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-opacity ${dragIdx === i ? "opacity-40" : ""}`}
            >
              <span className="cursor-grab active:cursor-grabbing text-muted-foreground select-none" title="Arrastrar">⠿</span>
              <span className="font-mono text-xs text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-sm">{labelOf(k)}</span>
              <Toggle checked={cfg.sections[k as keyof Cfg["sections"]]} onChange={(v) => setSec(k as keyof Cfg["sections"], v)}>
                <span className="text-xs text-muted-foreground">{cfg.sections[k as keyof Cfg["sections"]] ? "Visible" : "Oculta"}</span>
              </Toggle>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={status === "saving"} className="gap-2">
          {status === "saving" ? "Guardando…" : "Guardar cambios"}
        </Button>
        {status === "saved" && <span className="text-sm text-emerald-400">✓ Guardado — recarga la home para verlo</span>}
        {status === "error" && <span className="text-sm text-red-400">Error al guardar</span>}
      </div>
    </div>
  );
}
