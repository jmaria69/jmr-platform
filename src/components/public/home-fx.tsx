"use client";

import { useEffect } from "react";

/**
 * Efectos de la home (originales):
 *  - Reveals al hacer scroll.
 *  - Cursor "rayo": una estela eléctrica quebrada (violeta/magenta) sigue al
 *    puntero por toda la página y suelta partículas/chispas.
 *  - Hero: constelación viva (nodos + pulsos de señal) como ilustración propia.
 * Respeta prefers-reduced-motion y punteros táctiles.
 */
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

    // ── Cursor rayo + partículas (toda la página) ──
    if (!reduce && finePointer) {
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
      const cols = ["#e879f9", "#a855f7", "#c084fc"]; // magenta / violeta
      let last: Pt | null = null;
      let lastMove = 0;
      let raf = 0;

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX, ny = e.clientY;
        if (last) {
          const d = Math.hypot(nx - last.x, ny - last.y);
          const n = Math.min(5, Math.floor(d / 5));
          for (let i = 0; i < n; i++)
            sparks.push({ x: nx, y: ny, vx: (Math.random() - .5) * 1.8, vy: (Math.random() - .5) * 1.8 - .3, life: 0, max: 22 + Math.random() * 22, col: cols[(Math.random() * cols.length) | 0] });
        }
        trail.push({ x: nx, y: ny });
        if (trail.length > 16) trail.shift();
        last = { x: nx, y: ny };
        lastMove = performance.now();
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // segmento quebrado tipo rayo entre a y b (desplazamiento de punto medio)
      const jag = (a: Pt, b: Pt, amp: number): Pt[] => {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const off = (Math.random() - .5) * amp;
        return [a, { x: mx - (dy / len) * off, y: my + (dx / len) * off }];
      };

      const loop = () => {
        cx.clearRect(0, 0, w, h);
        const idle = performance.now() - lastMove > 40;
        if (idle && trail.length) trail.shift(); // se retrae cuando paras

        if (trail.length > 1) {
          const layers = [
            { width: 10, color: "rgba(168,85,247,.16)", amp: 5 },
            { width: 4.5, color: "rgba(232,121,249,.55)", amp: 4 },
            { width: 1.6, color: "rgba(255,255,255,.92)", amp: 3 },
          ];
          for (const L of layers) {
            cx.lineWidth = L.width; cx.strokeStyle = L.color; cx.lineCap = "round"; cx.lineJoin = "round";
            cx.beginPath();
            cx.moveTo(trail[0].x, trail[0].y);
            for (let i = 0; i < trail.length - 1; i++) {
              const seg = jag(trail[i], trail[i + 1], i > trail.length - 5 ? L.amp * 1.8 : L.amp);
              cx.lineTo(seg[1].x, seg[1].y);
              cx.lineTo(trail[i + 1].x, trail[i + 1].y);
            }
            cx.stroke();
          }
          // punta brillante
          const tip = trail[trail.length - 1];
          const g = cx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 22);
          g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(.4, "rgba(232,121,249,.5)"); g.addColorStop(1, "rgba(232,121,249,0)");
          cx.fillStyle = g; cx.beginPath(); cx.arc(tip.x, tip.y, 22, 0, 6.2832); cx.fill();
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life++; p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .99;
          const t = 1 - p.life / p.max;
          if (t <= 0) { sparks.splice(i, 1); continue; }
          cx.globalAlpha = t; cx.fillStyle = p.col;
          cx.beginPath(); cx.arc(p.x, p.y, 1.7 * t + .4, 0, 6.2832); cx.fill();
        }
        cx.globalAlpha = 1;
        raf = requestAnimationFrame(loop);
      };
      loop();

      const onResize = () => fit();
      window.addEventListener("resize", onResize);
      cleanups.push(() => { window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); cv.remove(); });
    }

    // ── Hero: constelación viva + pulsos (ilustración propia) ──
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    if (c) {
      const ctx = c.getContext("2d")!;
      type Star = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean; ph: number };
      type Pulse = { a: number; b: number; t: number; sp: number };
      let stars: Star[] = [];
      let pulses: Pulse[] = [];
      let W = 0, H = 0, time = 0, raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const size = () => { const r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      const init = () => {
        size();
        const n = Math.max(30, Math.min(90, Math.floor((W * H) / 11000)));
        stars = [];
        for (let i = 0; i < n; i++)
          stars.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .09, vy: (Math.random() - .5) * .09, r: Math.random() * 1.3 + .5, hot: Math.random() < .14, ph: Math.random() * 6.283 });
        pulses = [];
        const np = Math.min(7, Math.floor(n / 8));
        for (let i = 0; i < np; i++) { const a = (Math.random() * n) | 0; let b = (Math.random() * n) | 0; if (b === a) b = (b + 1) % n; pulses.push({ a, b, t: Math.random(), sp: .004 + Math.random() * .006 }); }
      };
      const draw = () => {
        time += .016; ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
            if (d < 110 * 110) { ctx.strokeStyle = `rgba(120,180,200,${.05 * (1 - Math.sqrt(d) / 110)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
        }
        for (const p of pulses) {
          p.t += p.sp; if (p.t > 1) { p.t = 0; p.a = (Math.random() * stars.length) | 0; let b = (Math.random() * stars.length) | 0; if (b === p.a) b = (b + 1) % stars.length; p.b = b; }
          const a = stars[p.a], b = stars[p.b]; if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
          ctx.strokeStyle = "rgba(0,242,255,.10)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.2832); ctx.fillStyle = "rgba(0,255,204,.9)"; ctx.fill();
        }
        for (const s of stars) {
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
          const tw = .4 + .6 * Math.abs(Math.sin(time * .6 + s.ph));
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832);
          ctx.fillStyle = s.hot ? `rgba(0,242,255,${.6 * tw})` : `rgba(220,235,245,${.34 * tw})`; ctx.fill();
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
