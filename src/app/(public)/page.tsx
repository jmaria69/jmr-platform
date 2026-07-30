import "./home-redesign.css";
import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { HomeFx } from "@/components/public/home-fx";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Praxia Labs — El trabajo que haces a mano, hecho solo",
  description:
    "Automatización a medida con agentes de IA. Diagnóstico de 15 min, operativo en 48 h. Sistemas propios en producción, no plantillas.",
};

const STATUS: Record<string, string> = {
  production: "EN PRODUCCIÓN",
  beta: "BETA",
  development: "EN DESARROLLO",
};
const ACCENTS = ["#00d4ff", "#ff5a36", "#f0b64a", "#4fe0c4"];

function esc(s: string): string {
  return (s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

export default async function Home() {
  const all = await findAllProjects();
  const chosen = all.filter((p) => p.showOnHome).slice(0, 4);
  const featured = chosen.length ? chosen : all.slice(0, 4);

  const prods = featured
    .map((p, i) => {
      const accent = ACCENTS[i % ACCENTS.length];
      const status = STATUS[p.status] || "EN PRODUCCIÓN";
      const cta = p.url
        ? `<a class="stat" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><b></b>Ver ${esc(p.name)} &rarr;</a>`
        : `<span class="stat"><b></b>${status}</span>`;
      return `
        <div class="prod rev" style="--accent:${accent}">
          <span class="st">&#9679; ${status}</span>
          <div class="tag mono">${esc(p.category)}</div>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          ${cta}
        </div>`;
    })
    .join("");

  const html = `
  <header class="hero">
    <div class="glow"></div>
    <canvas aria-hidden="true"></canvas>
    <div class="wrap"><div class="hero-grid">
      <div>
        <span class="tagline"><b></b>Automatización a medida &middot; desde España</span>
        <h1>El trabajo que haces a mano, <em>hecho solo</em>.</h1>
        <p class="lede">No vendemos "IA". Nos sentamos 15 minutos contigo, encontramos qué te come el día &mdash; facturas, seguimiento, informes &mdash; y <b>montamos un sistema que lo hace por ti</b>. En producción, no en diapositivas.</p>
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
  </div></div></div>

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
  </div></section>

  <section class="blk" id="servicios" style="padding-top:0"><div class="wrap">
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
  </div></section>

  <section class="blk" id="como" style="padding-top:0"><div class="wrap">
    <p class="lbl rev">Por qué nosotros</p>
    <h2 class="rev">Ingeniería de verdad, <em>trato de cofundador</em>.</h2>
    <div class="pillars">
      <div class="pillar rev"><div class="no">01</div><h3>No vendemos IA</h3><p>Vendemos que tu problema desaparezca. La tecnología es el cómo; el resultado es lo que pagas.</p></div>
      <div class="pillar rev"><div class="no">02</div><h3>En producción, no en slides</h3><p>Todo lo que ves ya corre 24/7. Sin plantillas genéricas: rigor técnico sobre tu caso real.</p></div>
      <div class="pillar rev"><div class="no">03</div><h3>Del diagnóstico al lunes</h3><p>Hablas directamente con quien lo construye. Operativo en 48 h y soporte real en menos de 2 h.</p></div>
    </div>
  </div></section>

  <section class="blk" id="productos" style="padding-top:0"><div class="wrap">
    <p class="lbl rev">Casos reales</p>
    <h2 class="rev">Sistemas propios, <em>funcionando ahora</em>.</h2>
    <p class="sec-lede rev">No son demos: son productos en producción. La prueba de que lo que prometemos, se entrega.</p>
    <div class="prods">${prods}</div>
  </div></section>

  <section class="blk final" id="contacto"><div class="wrap">
    <p class="lbl rev" style="justify-content:center">Empieza aquí</p>
    <h2 class="rev">Cuéntanos qué te come el día. <em>Del resto nos encargamos.</em></h2>
    <p class="rev">15 minutos, sin compromiso. Te decimos exactamente qué se puede automatizar y cuánto tiempo recuperas.</p>
    <div class="rev"><a href="/contacto" class="btn pri" style="padding:17px 34px;font-size:16px">Reservar diagnóstico gratuito</a></div>
  </div></section>

  <div class="foot"><div class="wrap"><div class="row">
    <span>Praxia Labs &middot; Automatización con agentes, desde España</span>
    <span class="mono">hola@praxialabs.com</span>
  </div></div></div>
  `;

  return (
    <>
      <HomeFx />
      <div className="lx" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
