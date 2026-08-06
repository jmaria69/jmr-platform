import "./home-redesign.css";
import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { getHomeConfig } from "@/lib/home-config";
import { HomeFx } from "@/components/public/home-fx";
import { ContactForm } from "@/components/public/contact-form";
import { buildNeuralRowHtml } from "./neural-timeline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Praxia Labs — El trabajo que haces a mano, hecho solo",
  description:
    "Automatización a medida con agentes de IA. Diagnóstico de 15 min, operativo en 48 h. Sistemas propios en producción, no plantillas.",
};

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
    <div class="glow"></div>
    <canvas aria-hidden="true"></canvas>
    <div class="wrap"><div class="hero-grid">
      <div>
        <span class="tagline"><b></b>${esc(H.tagline)}</span>
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
        <div class="brand"><span class="mk"></span> Praxia&nbsp;Labs</div>
        <p>Automatización con agentes de IA, a medida. Sistemas propios en producción — desde España.</p>
      </div>
      <div class="fcol">
        <h4>Producto</h4>
        <a href="/siam">SIAM</a><a href="/core-ops">Core OPS</a><a href="/adminapp">AdminApp</a><a href="/laboratorio">Laboratorio</a>
      </div>
      <div class="fcol">
        <h4>Praxia</h4>
        <a href="#servicios">Qué automatizamos</a><a href="#como">Por qué nosotros</a><a href="/precios">Precios</a><a href="/contacto">Contacto</a>
      </div>
      <div class="fcol">
        <h4>Contacto</h4>
        <a href="mailto:hola@praxialabs.com">hola@praxialabs.com</a><span>Diagnóstico de 15 min, gratis</span><span>Operativo desde el lunes</span>
      </div>
    </div>
    <div class="fbot"><span>&copy; ${new Date().getFullYear()} Praxia Labs</span><span class="mono">Hecho en España</span></div>
  </div></div>`;

  // Secciones HTML (contacto se renderiza como componente React con el formulario)
  const secMap: Record<string, string> = { problema, servicios, como, productos };
  const styleVars = { "--cyan": cfg.accent, "--blue": cfg.accentBlue } as React.CSSProperties;

  return (
    <>
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
