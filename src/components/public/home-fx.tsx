"use client";

import { useEffect } from "react";

/**
 * Efectos de la home (originales, no copiados):
 *  - Reveals al hacer scroll.
 *  - Spotlight cian que sigue al cursor por toda la página.
 *  - Hero: constelación viva (nodos + pulsos de señal viajando) que además
 *    REACCIONA al cursor conectando los nodos cercanos (tema agentes/red).
 * Respeta prefers-reduced-motion y punteros táctiles.
 */
export function HomeFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lx");
    if (!root) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    // ── Reveals ──
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.14 },
      );
      root.querySelectorAll<HTMLElement>(".rev").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
      cleanups.push(() => io.disconnect());
    } else {
      root.querySelectorAll(".rev").forEach((el) => el.classList.add("in"));
    }

    // ── Spotlight que sigue al cursor (toda la página) ──
    if (!reduce && finePointer) {
      const spot = document.createElement("div");
      Object.assign(spot.style, {
        position: "fixed", top: "0", left: "0", width: "460px", height: "460px",
        marginLeft: "-230px", marginTop: "-230px", borderRadius: "50%", pointerEvents: "none",
        zIndex: "0", mixBlendMode: "screen", opacity: "0", transition: "opacity .4s",
        background: "radial-gradient(circle, rgba(0,242,255,.10), rgba(0,255,204,.05) 40%, transparent 68%)",
        willChange: "transform",
      } as CSSStyleDeclaration);
      root.appendChild(spot);
      let sx = 0, sy = 0, spraf = 0;
      const moveSpot = () => { spot.style.transform = `translate(${sx}px, ${sy}px)`; spraf = 0; };
      const onMove = (e: PointerEvent) => {
        sx = e.clientX; sy = e.clientY; spot.style.opacity = "1";
        if (!spraf) spraf = requestAnimationFrame(moveSpot);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => { window.removeEventListener("pointermove", onMove); if (spraf) cancelAnimationFrame(spraf); spot.remove(); });
    }

    // ── Hero: constelación viva + pulsos + reacción al cursor ──
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    if (c) {
      const ctx = c.getContext("2d")!;
      type Star = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean; ph: number };
      type Pulse = { a: number; b: number; t: number; sp: number };
      let stars: Star[] = [];
      let pulses: Pulse[] = [];
      let W = 0, H = 0, time = 0, raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mouse = { x: -1, y: -1, on: false };

      const size = () => {
        const r = c.getBoundingClientRect();
        W = r.width; H = r.height;
        c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const init = () => {
        size();
        const n = Math.max(30, Math.min(90, Math.floor((W * H) / 11000)));
        stars = [];
        for (let i = 0; i < n; i++)
          stars.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .09, vy: (Math.random() - .5) * .09, r: Math.random() * 1.3 + .5, hot: Math.random() < .14, ph: Math.random() * 6.283 });
        // pulsos: unas cuantas conexiones con "paquetes" viajando
        pulses = [];
        const np = Math.min(7, Math.floor(n / 8));
        for (let i = 0; i < np; i++) {
          const a = (Math.random() * n) | 0; let b = (Math.random() * n) | 0; if (b === a) b = (b + 1) % n;
          pulses.push({ a, b, t: Math.random(), sp: 0.004 + Math.random() * 0.006 });
        }
      };
      const draw = () => {
        time += 0.016;
        ctx.clearRect(0, 0, W, H);

        // constelación: líneas faint entre nodos cercanos
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
            if (d < 110 * 110) {
              ctx.strokeStyle = `rgba(120,180,200,${0.05 * (1 - Math.sqrt(d) / 110)})`;
              ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }

        // reacción al cursor: conecta nodos cercanos + glow
        if (mouse.on) {
          for (const s of stars) {
            const dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.hypot(dx, dy);
            if (d < 170) {
              ctx.strokeStyle = `rgba(0,242,255,${0.22 * (1 - d / 170)})`;
              ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(s.x, s.y); ctx.stroke();
            }
          }
          const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
          g.addColorStop(0, "rgba(0,242,255,.10)"); g.addColorStop(1, "rgba(0,242,255,0)");
          ctx.fillStyle = g; ctx.fillRect(mouse.x - 90, mouse.y - 90, 180, 180);
        }

        // pulsos de señal viajando por conexiones
        for (const p of pulses) {
          p.t += p.sp; if (p.t > 1) { p.t = 0; p.a = (Math.random() * stars.length) | 0; let b = (Math.random() * stars.length) | 0; if (b === p.a) b = (b + 1) % stars.length; p.b = b; }
          const a = stars[p.a], b = stars[p.b]; if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
          ctx.strokeStyle = "rgba(0,242,255,.10)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.2832); ctx.fillStyle = "rgba(0,255,204,.9)"; ctx.fill();
        }

        // nodos
        for (const s of stars) {
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.6 + s.ph));
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832);
          ctx.fillStyle = s.hot ? `rgba(0,242,255,${0.6 * tw})` : `rgba(220,235,245,${0.34 * tw})`;
          ctx.fill();
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      };

      const rectOf = () => c.getBoundingClientRect();
      const onCanvasMove = (e: PointerEvent) => { const r = rectOf(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = mouse.x >= 0 && mouse.x <= W && mouse.y >= 0 && mouse.y <= H; };
      const onLeave = () => { mouse.on = false; };
      if (!reduce && finePointer) {
        window.addEventListener("pointermove", onCanvasMove, { passive: true });
        c.addEventListener("pointerleave", onLeave);
        cleanups.push(() => { window.removeEventListener("pointermove", onCanvasMove); c.removeEventListener("pointerleave", onLeave); });
      }

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
