"use client";

import { useEffect } from "react";

/**
 * Efectos de la home rediseñada: reveals al hacer scroll + red de nodos viva
 * en el hero. Se ejecuta en cliente sobre el markup .lx renderizado en el
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

    // Red de nodos
    const c = root.querySelector<HTMLCanvasElement>(".hero canvas");
    let raf = 0;
    let onResize: (() => void) | null = null;
    if (c) {
      const ctx = c.getContext("2d")!;
      let nodes: { x: number; y: number; vx: number; vy: number; r: number; hot: boolean }[] = [];
      let W = 0, H = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = () => {
        const r = c.getBoundingClientRect();
        W = r.width; H = r.height;
        c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const init = () => {
        size();
        const n = Math.max(14, Math.min(46, Math.floor((W * H) / 16000)));
        nodes = [];
        for (let i = 0; i < n; i++)
          nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.5 + 1, hot: Math.random() < .15 });
      };
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
            if (d < 130) {
              ctx.strokeStyle = `rgba(255,90,54,${0.13 * (1 - d / 130)})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const p of nodes) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fillStyle = p.hot ? "rgba(79,224,196,.85)" : "rgba(242,244,247,.35)";
          ctx.fill();
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      };
      init(); draw();
      let t: ReturnType<typeof setTimeout>;
      onResize = () => { clearTimeout(t); t = setTimeout(() => { cancelAnimationFrame(raf); init(); draw(); }, 200); };
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
