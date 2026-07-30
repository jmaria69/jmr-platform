"use client";

import { useEffect } from "react";

/**
 * Efectos de la home rediseñada (estilo loofidev): reveals al hacer scroll +
 * starfield sutil con twinkle en el hero. Cliente, sobre el markup .lx del
 * servidor. Respeta prefers-reduced-motion.
 */
export function HomeFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lx");
    if (!root) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Reveals
    let io: IntersectionObserver | null = null;
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.14 },
      );
      root.querySelectorAll<HTMLElement>(".rev").forEach((el, i) => {
        el.style.transitionDelay = `${(i % 3) * 70}ms`;
        io!.observe(el);
      });
    } else {
      root.querySelectorAll(".rev").forEach((el) => el.classList.add("in"));
    }

    // Starfield
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    let raf = 0;
    let onResize: (() => void) | null = null;
    if (c) {
      const ctx = c.getContext("2d")!;
      type Star = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean; ph: number };
      let stars: Star[] = [];
      let W = 0, H = 0, t = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = () => {
        const r = c.getBoundingClientRect();
        W = r.width; H = r.height;
        c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const init = () => {
        size();
        const n = Math.max(40, Math.min(140, Math.floor((W * H) / 7000)));
        stars = [];
        for (let i = 0; i < n; i++)
          stars.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .08, vy: (Math.random() - .5) * .08,
            r: Math.random() * 1.3 + .4, hot: Math.random() < .12, ph: Math.random() * 6.283,
          });
      };
      const draw = () => {
        t += 0.016;
        ctx.clearRect(0, 0, W, H);
        for (const p of stars) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.6 + p.ph));
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fillStyle = p.hot ? `rgba(0,242,255,${0.55 * tw})` : `rgba(220,235,245,${0.32 * tw})`;
          ctx.fill();
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      };
      init(); draw();
      let to: ReturnType<typeof setTimeout>;
      onResize = () => { clearTimeout(to); to = setTimeout(() => { cancelAnimationFrame(raf); init(); draw(); }, 200); };
      window.addEventListener("resize", onResize);
    }

    return () => {
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (onResize) window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
