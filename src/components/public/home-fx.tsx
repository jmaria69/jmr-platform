"use client";

import { useEffect } from "react";

/**
 * Efectos de la home (originales), configurables desde /admin/apariencia:
 *  - Reveals al hacer scroll.
 *  - Cursor "rayo" azul (por defecto) + partículas violeta/naranja, solo al
 *    moverse. Color/grosor/longitud/densidad vienen por props.
 *  - Hero: constelación viva (nodos + pulsos de señal).
 * Respeta prefers-reduced-motion y punteros táctiles.
 */

type Palette = { id: string; layers: [string, number][]; tip: string };
const PALETTES: Record<string, Palette> = {
  fuego: { id: "fuego", layers: [["rgba(0,230,255,.20)", 10], ["rgba(255,110,30,.60)", 4.5], ["rgba(255,245,220,.95)", 1.6]], tip: "255,140,40" },
  azul: { id: "azul", layers: [["rgba(91,124,250,.20)", 10], ["rgba(130,160,255,.60)", 4.5], ["rgba(240,245,255,.95)", 1.6]], tip: "120,150,255" },
  lima: { id: "lima", layers: [["rgba(124,255,107,.18)", 10], ["rgba(160,255,120,.58)", 4.5], ["rgba(240,255,220,.95)", 1.6]], tip: "150,255,110" },
  oro: { id: "oro", layers: [["rgba(255,170,40,.20)", 10], ["rgba(255,210,74,.60)", 4.5], ["rgba(255,248,220,.95)", 1.6]], tip: "255,160,50" },
  magenta: { id: "magenta", layers: [["rgba(168,85,247,.18)", 10], ["rgba(232,121,249,.58)", 4.5], ["rgba(255,240,255,.95)", 1.6]], tip: "232,121,249" },
  hielo: { id: "hielo", layers: [["rgba(120,200,255,.18)", 10], ["rgba(190,233,255,.58)", 4.5], ["rgba(255,255,255,.95)", 1.6]], tip: "150,215,255" },
};

// Mismas paletas pero oscurecidas: en marfil el canvas cambia a mezcla
// "multiply" (que oscurece sobre blanco en vez de "screen", que se funde
// a blanco puro y desaparece), así que el rayo necesita tonos oscuros
// para seguir siendo visible sobre fondo claro.
const PALETTES_IVORY: Record<string, Palette> = {
  fuego: { id: "fuego", layers: [["rgba(8,110,140,.22)", 10], ["rgba(200,70,10,.60)", 4.5], ["rgba(120,35,5,.95)", 1.6]], tip: "150,55,10" },
  azul: { id: "azul", layers: [["rgba(37,60,170,.22)", 10], ["rgba(45,80,210,.60)", 4.5], ["rgba(20,35,110,.95)", 1.6]], tip: "25,45,140" },
  lima: { id: "lima", layers: [["rgba(50,140,30,.20)", 10], ["rgba(65,170,40,.60)", 4.5], ["rgba(25,85,15,.95)", 1.6]], tip: "40,120,25" },
  oro: { id: "oro", layers: [["rgba(180,110,10,.22)", 10], ["rgba(200,135,15,.60)", 4.5], ["rgba(115,72,5,.95)", 1.6]], tip: "150,100,10" },
  magenta: { id: "magenta", layers: [["rgba(130,35,170,.20)", 10], ["rgba(160,45,190,.60)", 4.5], ["rgba(85,18,115,.95)", 1.6]], tip: "110,28,145" },
  hielo: { id: "hielo", layers: [["rgba(25,100,170,.20)", 10], ["rgba(35,130,200,.60)", 4.5], ["rgba(12,65,115,.95)", 1.6]], tip: "20,88,140" },
};

export type FxProps = {
  enabled?: boolean;
  bolt?: string;
  thickness?: number;
  length?: number;
  sparkDensity?: number;
  sparkColors?: string[];
  starfield?: boolean;
};

const FX_DEFAULT: Required<FxProps> = {
  enabled: true, bolt: "azul", thickness: 1, length: 22, sparkDensity: 1,
  sparkColors: ["#a88cff", "#c9b8e8", "#8f6dff", "#b9a6e6", "#ff8a3c", "#ff6a1e"], starfield: true,
};

export function HomeFx({ fx }: { fx?: FxProps }) {
  useEffect(() => {
    const cfg = { ...FX_DEFAULT, ...(fx ?? {}) };
    const root = document.querySelector<HTMLElement>(".lx");
    if (!root) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
    const cleanups: Array<() => void> = [];

    // ── Reveals ──
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.14 },
      );
      root.querySelectorAll<HTMLElement>(".rev").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else {
      root.querySelectorAll(".rev").forEach((el) => el.classList.add("in"));
    }

    // ── Cursor rayo + partículas ──
    if (!reduce && finePointer && cfg.enabled) {
      const pal = PALETTES[cfg.bolt] ?? PALETTES.azul;
      const SPARK_COLS = cfg.sparkColors.length ? cfg.sparkColors : FX_DEFAULT.sparkColors;
      const dens = Math.max(0, cfg.sparkDensity);
      const cap = Math.max(6, Math.min(40, Math.round(cfg.length)));

      const cv = document.createElement("canvas");
      Object.assign(cv.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "60", mixBlendMode: "screen" } as CSSStyleDeclaration);
      root.appendChild(cv);
      const cx = cv.getContext("2d")!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0;
      const fit = () => { w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      fit();

      type Pt = { x: number; y: number };
      type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string };
      const trail: Pt[] = [];
      const sparks: Spark[] = [];
      let last: Pt | null = null, lastMove = 0, raf = 0, frame = 0;
      const pick = () => SPARK_COLS[(Math.random() * SPARK_COLS.length) | 0];

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX, ny = e.clientY;
        if (last) {
          const d = Math.hypot(nx - last.x, ny - last.y);
          const n = Math.min(9, Math.floor((d / 5) * dens));
          for (let i = 0; i < n; i++) { const ang = Math.random() * 6.283, spd = 2 + Math.random() * 4.5; sparks.push({ x: nx, y: ny, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - .3, life: 0, max: 22 + Math.random() * 22, col: pick() }); }
        }
        trail.push({ x: nx, y: ny });
        if (trail.length > cap) trail.shift();
        last = { x: nx, y: ny }; lastMove = performance.now();
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const loop = () => {
        frame++;
        const ivory = document.documentElement.classList.contains("ivory");
        const activePal = ivory ? (PALETTES_IVORY[cfg.bolt] ?? PALETTES_IVORY.azul) : pal;
        const blend = ivory ? "multiply" : "screen";
        if (cv.style.mixBlendMode !== blend) cv.style.mixBlendMode = blend;
        cx.clearRect(0, 0, w, h);
        if (performance.now() - lastMove > 40 && trail.length && frame % 3 === 0) trail.shift();
        const moving = performance.now() - lastMove < 90;
        if (last && moving && sparks.length < 300) {
          const cnt = Math.round((frame % 2 === 0 ? 2 : 1) * dens);
          for (let k = 0; k < cnt; k++) { const ang = Math.random() * 6.283, spd = 1.8 + Math.random() * 4; sparks.push({ x: last.x, y: last.y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - .2, life: 0, max: 22 + Math.random() * 24, col: pick() }); }
        }
        if (trail.length > 1) {
          activePal.layers.forEach(([color, width], li) => {
            const scale = (li === 0 ? 0.6 : li === 1 ? 0.85 : 0.8) * cfg.thickness;
            cx.lineWidth = width * scale; cx.strokeStyle = color; cx.lineCap = "round"; cx.lineJoin = "round";
            cx.beginPath(); cx.moveTo(trail[0].x, trail[0].y);
            for (let i = 0; i < trail.length - 1; i++) {
              const a = trail[i], b = trail[i + 1];
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
              const off = (Math.random() - .5) * (i > trail.length - 5 ? 12 : 7);
              cx.lineTo(mx - (dy / len) * off, my + (dx / len) * off); cx.lineTo(b.x, b.y);
            }
            cx.stroke();
          });
          const tip = trail[trail.length - 1];
          cx.fillStyle = ivory ? `rgba(${activePal.tip},.95)` : "rgba(255,255,255,.95)"; cx.beginPath(); cx.arc(tip.x, tip.y, 2 * cfg.thickness, 0, 6.2832); cx.fill();
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i]; p.life++; p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .99;
          const t = 1 - p.life / p.max; if (t <= 0) { sparks.splice(i, 1); continue; }
          cx.globalAlpha = t; cx.fillStyle = p.col; cx.beginPath(); cx.arc(p.x, p.y, 1.5 * t + .35, 0, 6.2832); cx.fill();
        }
        cx.globalAlpha = 1; raf = requestAnimationFrame(loop);
      };
      loop();

      const onResize = () => fit();
      window.addEventListener("resize", onResize);
      cleanups.push(() => { window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); cv.remove(); });
    }

    // ── Hero: constelación viva + pulsos ──
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    if (c && cfg.starfield) {
      const ctx = c.getContext("2d")!;
      type Star = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean; ph: number };
      type Pulse = { a: number; b: number; t: number; sp: number };
      let stars: Star[] = [], pulses: Pulse[] = [];
      let W = 0, H = 0, time = 0, raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = () => { const r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      const init = () => {
        size();
        const n = Math.max(34, Math.min(96, Math.floor((W * H) / 10000)));
        stars = [];
        for (let i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .1, vy: (Math.random() - .5) * .1, r: Math.random() * 1.4 + .6, hot: Math.random() < .18, ph: Math.random() * 6.283 });
        pulses = [];
        const np = Math.min(9, Math.floor(n / 7));
        for (let i = 0; i < np; i++) { const a = (Math.random() * n) | 0; let b = (Math.random() * n) | 0; if (b === a) b = (b + 1) % n; pulses.push({ a, b, t: Math.random(), sp: .005 + Math.random() * .006 }); }
      };
      const draw = () => {
        time += .016; ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
            if (d < 128 * 128) { ctx.strokeStyle = `rgba(90,200,220,${.13 * (1 - Math.sqrt(d) / 128)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
        }
        for (const p of pulses) {
          p.t += p.sp; if (p.t > 1) { p.t = 0; p.a = (Math.random() * stars.length) | 0; let b = (Math.random() * stars.length) | 0; if (b === p.a) b = (b + 1) % stars.length; p.b = b; }
          const a = stars[p.a], b = stars[p.b]; if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
          ctx.strokeStyle = "rgba(0,242,255,.20)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.2832); ctx.fillStyle = "rgba(0,255,204,1)"; ctx.shadowColor = "rgba(0,255,204,.9)"; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
        }
        for (const s of stars) {
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
          const tw = .45 + .55 * Math.abs(Math.sin(time * .6 + s.ph));
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832);
          ctx.fillStyle = s.hot ? `rgba(0,242,255,${.85 * tw})` : `rgba(220,235,245,${.5 * tw})`; ctx.fill();
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      };
      init(); draw();
      let to: ReturnType<typeof setTimeout>;
      const onResize = () => { clearTimeout(to); to = setTimeout(() => { cancelAnimationFrame(raf); init(); draw(); }, 200); };
      window.addEventListener("resize", onResize);
      cleanups.push(() => { window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [fx]);

  return null;
}
