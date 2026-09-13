"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

// Eventos que cuentan como "el usuario ya está interactuando" -- cargar gtag.js
// (167 KiB) recién entonces evita que su evaluación compita por el hilo
// principal durante la carga inicial (ver PageSpeed: "Minimiza el trabajo del
// hilo principal"). Con un timeout de respaldo por si nadie interactúa.
const INTERACTION_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
const FALLBACK_DELAY_MS = 4000;

// No se rastrea /admin/*: es la propia actividad del admin autenticado, no
// tráfico de visitante — no debe salir hacia Google Analytics.
export function GoogleAnalytics() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const load = () => setShouldLoad(true);
    INTERACTION_EVENTS.forEach((ev) => window.addEventListener(ev, load, { once: true, passive: true }));
    const timeout = window.setTimeout(load, FALLBACK_DELAY_MS);

    return () => {
      INTERACTION_EVENTS.forEach((ev) => window.removeEventListener(ev, load));
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin") || !shouldLoad) return null;

  return (
    <>
      <Script strategy="afterInteractive" src="/gtag/js" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CQ6W47R42W', {
        transport_url: 'https://praxialabs.com',
        first_party_collection: true,
      });
    `,
        }}
      />
    </>
  );
}
