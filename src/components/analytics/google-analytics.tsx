"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// No se rastrea /admin/*: es la propia actividad del admin autenticado, no
// tráfico de visitante — no debe salir hacia Google Analytics.
export function GoogleAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

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
