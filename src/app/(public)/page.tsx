import "./home-redesign.css";
import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { getHomeConfig } from "@/lib/home-config";
import { HomeFx } from "@/components/public/home-fx";
import { ContactForm } from "@/components/public/contact-form";
import { buildNeuralRowHtml } from "./neural-timeline";
import { CONTACT_EMAIL } from "@/lib/constants";

export const dynamic = "force-dynamic";

const BASE_URL = "https://praxialabs.com";
const SITE_DESCRIPTION =
  "Automatización a medida con agentes de IA. Diagnóstico de 15 min, operativo en 48 h. Sistemas propios en producción, no plantillas.";

export const metadata: Metadata = {
  title: "El trabajo que haces a mano, hecho solo",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    languages: { en: "/en", "x-default": "/" },
  },
};

export const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Praxia Labs",
  url: BASE_URL,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  address: { "@type": "PostalAddress", addressCountry: "ES" },
  sameAs: ["https://www.linkedin.com/company/130074338/"],
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "sales",
    areaServed: "ES",
    availableLanguage: ["Spanish"],
  },
};

// Imagotipo del átomo (mismo SVG que PraxiaLabLogo) inyectado como string: el footer de
// esta página es HTML crudo vía dangerouslySetInnerHTML, no JSX, así que no podemos usar
// el componente React directamente.
const LOGO_SVG = `<svg width="30" height="30" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
  <defs>
    <linearGradient id="flg" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284c7" /><stop offset="50%" stop-color="#0369a1" /><stop offset="100%" stop-color="#075985" />
    </linearGradient>
    <filter id="flg-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#0369a1" flood-opacity="1" /></filter>
    <filter id="flg-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#0284c7" flood-opacity="1" /></filter>
    <filter id="flg-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#075985" flood-opacity="1" /></filter>
    <filter id="flg-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#34d399" flood-opacity="1" /></filter>
    <filter id="flg-core"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.9" /></filter>
  </defs>
  <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#flg)" stroke-width="1.3" fill="none" opacity="0.45" />
  <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#flg)" stroke-width="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)" />
  <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#flg)" stroke-width="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)" />
  <circle cx="36" cy="36" r="5.5" fill="url(#flg)" filter="url(#flg-core)" />
  <circle cx="36" cy="36" r="2.5" fill="white" opacity="0.95" />
  <circle fill="#0369a1" filter="url(#flg-fc)">
    <animate attributeName="cx" dur="5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
    <animate attributeName="cy" dur="5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
    <animate attributeName="r" dur="2.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
  <circle fill="#38bdf8" filter="url(#flg-fc)" opacity="0.85">
    <animate attributeName="cx" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
    <animate attributeName="cy" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
    <animate attributeName="r" dur="1.7s" begin="-0.9s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
  <circle fill="#f472b6" filter="url(#flg-fp)">
    <animate attributeName="cx" dur="7s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
    <animate attributeName="cy" dur="7s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
    <animate attributeName="r" dur="2.5s" begin="-0.5s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
  <circle fill="#e879f9" filter="url(#flg-fp)" opacity="0.85">
    <animate attributeName="cx" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
    <animate attributeName="cy" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
    <animate attributeName="r" dur="1.9s" begin="-1.2s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
  <circle fill="#a78bfa" filter="url(#flg-fv)">
    <animate attributeName="cx" dur="6s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
    <animate attributeName="cy" dur="6s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
    <animate attributeName="r" dur="2.3s" begin="-1.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
  <circle fill="#0c4a6e" filter="url(#flg-fg)" opacity="0.9">
    <animate attributeName="cx" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
    <animate attributeName="cy" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
    <animate attributeName="r" dur="2.0s" begin="-0.3s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
  </circle>
</svg>`;

function esc(s: string): string {
  return (s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

export default async function Home() {
  const [all, cfg] = await Promise.all([findAllProjects(), getHomeConfig()]);
  const chosen = all.filter((p) => p.showOnHome).slice(0, 8);
  const featured = chosen.length ? chosen : all.slice(0, 6);

  const prods = featured.map((p, i) => buildNeuralRowHtml(p, i)).join("");

  const H = cfg.hero;
  const S = cfg.sections;

  const hero = `
  <header class="hero">
    <div class="grid-bg"></div>
    <canvas aria-hidden="true"></canvas>
    <div class="wrap"><div class="hero-grid">
      <div>
        <span class="tagline">${esc(H.tagline)}</span>
        <h1>${esc(H.h1)} <em>${esc(H.h1em)}</em>.</h1>
        <p class="lede">${esc(H.lede)}</p>
        <div class="cta-row">
          <a href="/contacto" class="btn pri">Reservar diagnóstico gratuito</a>
          <a href="#productos" class="btn sec">Ver casos reales &rarr;</a>
        </div>
      </div>
      <div class="editor" role="img" aria-label="Configuración de agentes que compila en resultados reales">
        <div class="ed-bar">
          <span class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span>
          <span class="file mono">praxia.config.ts</span>
        </div>
        <div class="code mono"><pre><span class="kw">import</span> { Agente } <span class="kw">from</span> <span class="str">'@praxia/core'</span>
<span class="cm">// inicializando agentes en producción...</span></pre></div>
        <div class="ed-rows">
          <div class="ed-row"><span class="lab">OLGA.ai<small>operaciones &middot; back-office</small></span><span class="pill green">&#9679; EN VIVO</span></div>
          <div class="ed-row"><span class="lab">Facturas procesadas hoy<small>AdminApp &middot; VERA</small></span><span class="pill cyan">318 &middot; 0 err</span></div>
          <div class="ed-row"><span class="lab">Horas recuperadas<small>por semana, en todos los agentes</small></span><span class="pill blue">26 h &uarr;</span></div>
        </div>
      </div>
    </div></div>
  </header>

  <div class="trust"><div class="wrap"><div class="row">
    <span class="item"><b>Sistemas propios en producción</b>, no plantillas</span>
    <span class="item">De idea a agente en <span class="mono">&lt;48 h</span></span>
    <span class="item">Soporte real en <span class="mono">&lt;2 h</span></span>
    <span class="item">Cumplimiento <span class="mono">NIS2</span> incluido</span>
  </div></div></div>`;

  const problema = !S.problema ? "" : `
  <section class="blk" id="problema"><div class="wrap">
    <p class="lbl rev">El problema</p>
    <h2 class="rev">Lo repetitivo te está <em>frenando el negocio</em>.</h2>
    <p class="sec-lede rev">Lo oímos cada semana. No es falta de gente &mdash; es que las mismas tareas se lo comen todo.</p>
    <div class="quotes">
      <div class="quote rev"><div class="qm">&ldquo;</div><p>Reviso y clasifico cientos de facturas a mano cada mes. Un agujero de tiempo.</p><div class="who mono">GESTORA DE FINCAS</div></div>
      <div class="quote rev"><div class="qm">&ldquo;</div><p>Los correos importantes se me acumulan sin responder. Algo siempre se escapa.</p><div class="who mono">OPERACIONES &middot; PYME</div></div>
      <div class="quote rev"><div class="qm">&ldquo;</div><p>Detectar incidentes de red a mano deja huecos y respuestas lentas.</p><div class="who mono">IT &middot; INFRAESTRUCTURA</div></div>
    </div>
    <p class="resolve rev"><span class="ar">&rarr;</span>No necesitas contratar más. Necesitas que <b>eso se haga solo</b>.</p>
  </div></section>`;

  const servicios = !S.servicios ? "" : `
  <section class="blk" id="servicios"><div class="wrap">
    <p class="lbl rev">Qué automatizamos</p>
    <h2 class="rev">Menos tareas tuyas. <em>Más negocio.</em></h2>
    <p class="sec-lede rev">Cada bloque es un problema real que dejas de tocar. Conectado a lo que ya usas.</p>
    <div class="svc">
      <div class="cell rev"><div class="ic">&#8377;</div><h3>Facturas y administración</h3><p>Clasificar, validar y registrar cada factura sin intervención. Con módulo financiero.</p><div class="was">antes: 2 días/mes a mano</div></div>
      <div class="cell rev"><div class="ic">&#9993;</div><h3>Atención y seguimiento</h3><p>Categoriza correos, redacta respuestas y crea tareas. Nada se escapa.</p><div class="was">antes: bandeja siempre llena</div></div>
      <div class="cell rev"><div class="ic">&#9672;</div><h3>Ciberseguridad 24/7</h3><p>Monitoriza la red en tiempo real, clasifica amenazas y avisa con protocolo.</p><div class="was">antes: revisión con huecos</div></div>
      <div class="cell rev"><div class="ic">&#9881;</div><h3>Operaciones IT</h3><p>Red, ERP, inventario y alertas en un panel único, en lugar de seis herramientas sueltas.</p><div class="was">antes: seis pestañas abiertas</div></div>
      <div class="cell rev"><div class="ic">&#8596;</div><h3>Integraciones</h3><p>Conectamos el agente a tus sistemas actuales &mdash; ERP, email, Google Workspace, Telegram.</p><div class="was">sin migrar nada</div></div>
      <div class="cell rev"><div class="ic">&#9671;</div><h3>Software a medida</h3><p>Cuando no hay herramienta que sirva, la construimos. En producción, no en beta eterna.</p><div class="was">a tu problema exacto</div></div>
    </div>
  </div></section>`;

  const como = !S.como ? "" : `
  <section class="blk" id="como"><div class="wrap">
    <p class="lbl rev">Por qué nosotros</p>
    <h2 class="rev">Ingeniería de verdad, <em>trato de cofundador</em>.</h2>
    <div class="pillars">
      <div class="pillar rev"><div class="no">01</div><h3>No vendemos IA</h3><p>Vendemos que tu problema desaparezca. La tecnología es el cómo; el resultado es lo que pagas.</p></div>
      <div class="pillar rev"><div class="no">02</div><h3>En producción, no en slides</h3><p>Todo lo que ves ya corre 24/7. Sin plantillas genéricas: rigor técnico sobre tu caso real.</p></div>
      <div class="pillar rev"><div class="no">03</div><h3>Del diagnóstico al lunes</h3><p>Hablas directamente con quien lo construye. Operativo en 48 h y soporte real en menos de 2 h.</p></div>
    </div>
  </div></section>`;

  const productos = !S.productos ? "" : `
  <section class="blk" id="productos"><div class="wrap">
    <p class="lbl rev">Casos reales</p>
    <h2 class="rev">Sistemas propios, <em>funcionando ahora</em>.</h2>
    <p class="sec-lede rev">No son demos: son productos en producción. La prueba de que lo que prometemos, se entrega.</p>
    <div class="neural">${prods}</div>
  </div></section>`;

  const foot = `
  <div class="foot"><div class="wrap">
    <div class="fcols">
      <div class="fbrand">
        <div class="brand">${LOGO_SVG} Praxia&nbsp;Labs</div>
        <p>Automatización con agentes de IA, a medida. Sistemas propios en producción — desde España.</p>
      </div>
      <div class="fcol">
        <h3>Producto</h3>
        <a href="/siam">SIAM</a><a href="/core-ops">Core OPS</a><a href="/adminapp">AdminApp</a><a href="/laboratorio">Laboratorio</a>
      </div>
      <div class="fcol">
        <h3>Praxia</h3>
        <a href="#servicios">Qué automatizamos</a><a href="#como">Por qué nosotros</a><a href="/precios">Precios</a><a href="/acerca-de">Acerca de</a><a href="/contacto">Contacto</a>
      </div>
      <div class="fcol">
        <h3>Contacto</h3>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><span>Diagnóstico de 15 min, gratis</span><span>Operativo desde el lunes</span><a href="/politica-privacidad">Política de privacidad</a>
      </div>
    </div>
    <div class="fbot"><span>&copy; ${new Date().getFullYear()} Praxia Labs</span><span class="mono">Hecho en España</span></div>
  </div></div>`;

  // Secciones HTML (contacto se renderiza como componente React con el formulario)
  const secMap: Record<string, string> = { problema, servicios, como, productos };
  const styleVars = { "--cyan": cfg.accent, "--blue": cfg.accentBlue } as React.CSSProperties;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      {/* Sin JS, la animación de scroll-reveal (.rev, opacity:0 hasta que
          HomeFx añade .in) nunca se dispara — esto la neutraliza solo para
          navegadores/agentes sin JS, sin tocar la experiencia normal. */}
      <noscript>
        <style>{`.lx .rev { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <HomeFx fx={{ enabled: cfg.effectsEnabled, bolt: cfg.bolt, thickness: cfg.thickness, length: cfg.length, sparkDensity: cfg.sparkDensity, sparkColors: cfg.sparkColors, starfield: cfg.starfield }} />
      <div className="lx" style={styleVars}>
        <div dangerouslySetInnerHTML={{ __html: hero }} />
        {cfg.sectionOrder.map((k) =>
          k === "contacto"
            ? (cfg.sections.contacto ? <ContactSection key="contacto" /> : null)
            : (secMap[k] ? <div key={k} dangerouslySetInnerHTML={{ __html: secMap[k] }} /> : null),
        )}
        <div dangerouslySetInnerHTML={{ __html: foot }} />
      </div>
    </>
  );
}

function ContactSection() {
  return (
    <section className="blk final" id="contacto">
      <div className="glow2" />
      <div className="wrap">
        <p className="lbl rev" style={{ justifyContent: "center" }}>Empieza aquí</p>
        <h2 className="rev">
          Cuéntanos qué te come el día. <em>Del resto nos encargamos.</em>
        </h2>
        <p className="rev" style={{ marginBottom: "24px" }}>
          15 minutos, sin compromiso. Te decimos exactamente qué se puede automatizar y cuánto tiempo recuperas.
        </p>
        <div className="contact-card rev">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
