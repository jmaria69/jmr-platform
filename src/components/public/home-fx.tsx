"use client";

import { useEffect } from "react";

/**
 * Efectos de la home (originales):
 *  - Reveals al hacer scroll.
 *  - Cursor "rayo": estela eléctrica corta + partículas que sigue al puntero.
 *    Paleta elegible en vivo (selector abajo-izquierda), por defecto Cian+Fuego.
 *  - Hero: constelación viva (nodos + pulsos de señal) como ilustración propia.
 * Respeta prefers-reduced-motion y punteros táctiles.
 */

type Palette = { id: string; label: string; swatch: string; layers: [string, number][]; tip: string; sparks: string[] };

const PALETTES: Palette[] = [
  { id: "fuego", label: "Cian + Fuego", swatch: "linear-gradient(135deg,#00f2ff,#ff6a1e)",
    layers: [["rgba(0,230,255,.20)", 10], ["rgba(255,110,30,.60)", 4.5], ["rgba(255,245,220,.95)", 1.6]], tip: "255,140,40", sparks: ["#00f2ff", "#ff7a1e", "#ffd24a"] },
  { id: "azul", label: "Azul eléctrico", swatch: "#5b7cfa",
    layers: [["rgba(91,124,250,.20)", 10], ["rgba(130,160,255,.60)", 4.5], ["rgba(240,245,255,.95)", 1.6]], tip: "120,150,255", sparks: ["#5b7cfa", "#9db4ff", "#ffffff"] },
  { id: "lima", label: "Verde-lima", swatch: "#7cff6b",
    layers: [["rgba(124,255,107,.18)", 10], ["rgba(160,255,120,.58)", 4.5], ["rgba(240,255,220,.95)", 1.6]], tip: "150,255,110", sparks: ["#7cff6b", "#c6ff9e", "#ffffff"] },
  { id: "oro", label: "Dorado", swatch: "#ffd24a",
    layers: [["rgba(255,170,40,.20)", 10], ["rgba(255,210,74,.60)", 4.5], ["rgba(255,248,220,.95)", 1.6]], tip: "255,160,50", sparks: ["#ffd24a", "#ff9a3c", "#fff2c0"] },
  { id: "magenta", label: "Magenta", swatch: "#e879f9",
    layers: [["rgba(168,85,247,.18)", 10], ["rgba(232,121,249,.58)", 4.5], ["rgba(255,240,255,.95)", 1.6]], tip: "232,121,249", sparks: ["#e879f9", "#c084fc", "#ffffff"] },
  { id: "hielo", label: "Hielo", swatch: "#bfe9ff",
    layers: [["rgba(120,200,255,.18)", 10], ["rgba(190,233,255,.58)", 4.5], ["rgba(255,255,255,.95)", 1.6]], tip: "150,215,255", sparks: ["#bfe9ff", "#ffffff", "#8fd0ff"] },
];

export function HomeFx() {
  useEffect(() => {
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

    // ── Cursor rayo + selector de color ──
    if (!reduce && finePointer) {
      let pal = PALETTES.find((p) => p.id === localStorage.getItem("praxia-bolt")) ?? PALETTES[0];

      const cv = document.createElement("canvas");
      Object.assign(cv.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "60", mixBlendMode: "screen" } as CSSStyleDeclaration);
      root.appendChild(cv);
      const cx = cv.getContext("2d")!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0;
      const fit = () => { w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      fit();

      // Selector de paleta (ayuda temporal de ajuste)
      const picker = document.createElement("div");
      Object.assign(picker.style, { position: "fixed", left: "16px", bottom: "16px", zIndex: "70", display: "flex", gap: "7px", alignItems: "center", padding: "8px 10px", borderRadius: "999px", background: "rgba(16,18,22,.8)", border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(8px)" } as CSSStyleDeclaration);
      const lbl = document.createElement("span");
      Object.assign(lbl.style, { font: "11px ui-monospace,monospace", color: "#9aa1ad", marginRight: "3px" } as CSSStyleDeclaration);
      lbl.textContent = "⚡";
      picker.appendChild(lbl);
      PALETTES.forEach((p) => {
        const b = document.createElement("button");
        b.title = p.label;
        Object.assign(b.style, { width: "18px", height: "18px", borderRadius: "50%", cursor: "pointer", background: p.swatch, border: p.id === pal.id ? "2px solid #fff" : "2px solid transparent", padding: "0", boxShadow: "0 0 0 1px rgba(255,255,255,.15)" } as CSSStyleDeclaration);
        b.addEventListener("click", () => {
          pal = p; localStorage.setItem("praxia-bolt", p.id);
          picker.querySelectorAll("button").forEach((x, i) => (x as HTMLElement).style.border = PALETTES[i].id === p.id ? "2px solid #fff" : "2px solid transparent");
        });
        picker.appendChild(b);
      });
      root.appendChild(picker);

      type Pt = { x: number; y: number };
      type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string };
      const trail: Pt[] = [];
      const sparks: Spark[] = [];
      let last: Pt | null = null, lastMove = 0, raf = 0, frame = 0;

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX, ny = e.clientY;
        if (last) {
          const d = Math.hypot(nx - last.x, ny - last.y);
          const n = Math.min(7, Math.floor(d / 5));
          for (let i = 0; i < n; i++) sparks.push({ x: nx, y: ny, vx: (Math.random() - .5) * 2.4, vy: (Math.random() - .5) * 2.4 - .4, life: 0, max: 22 + Math.random() * 22, col: pal.sparks[(Math.random() * pal.sparks.length) | 0] });
        }
        trail.push({ x: nx, y: ny });
        if (trail.length > 22) trail.shift(); // más larga
        last = { x: nx, y: ny }; lastMove = performance.now();
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const loop = () => {
        frame++;
        cx.clearRect(0, 0, w, h);
        // se retrae más despacio (dura más) al parar
        if (performance.now() - lastMove > 40 && trail.length && frame % 3 === 0) trail.shift();
        // chispas continuas: crepita desde que el cursor está en pantalla
        if (last && sparks.length < 260) {
          const cnt = frame % 2 === 0 ? 2 : 1;
          for (let k = 0; k < cnt; k++)
            sparks.push({ x: last.x + (Math.random() - .5) * 6, y: last.y + (Math.random() - .5) * 6, vx: (Math.random() - .5) * 2.2, vy: (Math.random() - .5) * 2.2 - .25, life: 0, max: 22 + Math.random() * 24, col: pal.sparks[(Math.random() * pal.sparks.length) | 0] });
        }
        if (trail.length > 1) {
          for (const [color, width] of pal.layers) {
            cx.lineWidth = width * 2.3; cx.strokeStyle = color; cx.lineCap = "round"; cx.lineJoin = "round";
            cx.beginPath(); cx.moveTo(trail[0].x, trail[0].y);
            for (let i = 0; i < trail.length - 1; i++) {
              const a = trail[i], b = trail[i + 1];
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
              const off = (Math.random() - .5) * (i > trail.length - 5 ? 16 : 10);
              cx.lineTo(mx - (dy / len) * off, my + (dx / len) * off); cx.lineTo(b.x, b.y);
            }
            cx.stroke();
          }
          const tip = trail[trail.length - 1];
          const g = cx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 44);
          g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(.4, `rgba(${pal.tip},.5)`); g.addColorStop(1, `rgba(${pal.tip},0)`);
          cx.fillStyle = g; cx.beginPath(); cx.arc(tip.x, tip.y, 44, 0, 6.2832); cx.fill();
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i]; p.life++; p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .99;
          const t = 1 - p.life / p.max; if (t <= 0) { sparks.splice(i, 1); continue; }
          cx.globalAlpha = t; cx.fillStyle = p.col; cx.beginPath(); cx.arc(p.x, p.y, 3 * t + .6, 0, 6.2832); cx.fill();
        }
        cx.globalAlpha = 1; raf = requestAnimationFrame(loop);
      };
      loop();

      const onResize = () => fit();
      window.addEventListener("resize", onResize);
      cleanups.push(() => { window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); cv.remove(); picker.remove(); });
    }

    // ── Hero: constelación viva + pulsos (más visible) ──
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    if (c) {
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
  }, []);

  return null;
}
