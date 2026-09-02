import "../home-redesign.css";
import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { getHomeConfig } from "@/lib/home-config";
import { HomeFx } from "@/components/public/home-fx";
import { ContactForm } from "@/components/public/contact-form";
import { buildNeuralRowHtml } from "../neural-timeline";
import { CONTACT_EMAIL } from "@/lib/constants";

export const dynamic = "force-dynamic";

const BASE_URL = "https://praxialabs.com";
const SITE_DESCRIPTION =
  "Custom automation with AI agents. 15-minute diagnostic, live in 48h. Our own systems in production — not templates.";

export const metadata: Metadata = {
  title: "The work you do by hand, done on its own",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/en",
    languages: { es: "/", "x-default": "/" },
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
    availableLanguage: ["English", "Spanish"],
  },
};

function esc(s: string): string {
  return (s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

export default async function HomeEn() {
  const [all, cfg] = await Promise.all([findAllProjects(), getHomeConfig()]);
  const chosen = all.filter((p) => p.showOnHome).slice(0, 8);
  const featured = chosen.length ? chosen : all.slice(0, 6);

  const prods = featured.map((p, i) => buildNeuralRowHtml(p, i, "en")).join("");

  const S = cfg.sections;

  // Hero copy is hardcoded in English — cfg.hero is admin-managed Spanish
  // content (see home-config.ts) and out of scope for this static translation.
  const hero = `
  <header class="hero">
    <div class="grid-bg"></div>
    <canvas aria-hidden="true"></canvas>
    <div class="wrap"><div class="hero-grid">
      <div>
        <span class="tagline">${esc("Custom automation · from Spain")}</span>
        <h1>${esc("The work you do by hand,")} <em>${esc("done on its own")}</em>.</h1>
        <p class="lede">${esc('We don\'t sell "AI". We sit down with you for 15 minutes, find what\'s eating your day — invoices, follow-ups, reports — and build a system that does it for you. In production, not in slides.')}</p>
        <div class="cta-row">
          <a href="/contact" class="btn pri">Book a free diagnostic</a>
          <a href="#productos" class="btn sec">See real cases &rarr;</a>
        </div>
      </div>
      <div class="editor" role="img" aria-label="Agent configuration compiling into real results">
        <div class="ed-bar">
          <span class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span>
          <span class="file mono">praxia.config.ts</span>
        </div>
        <div class="code mono"><pre><span class="kw">import</span> { Agent } <span class="kw">from</span> <span class="str">'@praxia/core'</span>
<span class="cm">// initializing agents in production...</span></pre></div>
        <div class="ed-rows">
          <div class="ed-row"><span class="lab">OLGA.ai<small>operations &middot; back-office</small></span><span class="pill green">&#9679; LIVE</span></div>
          <div class="ed-row"><span class="lab">Invoices processed today<small>AdminApp &middot; VERA</small></span><span class="pill cyan">318 &middot; 0 err</span></div>
          <div class="ed-row"><span class="lab">Hours recovered<small>per week, across all agents</small></span><span class="pill blue">26 h &uarr;</span></div>
        </div>
      </div>
    </div></div>
  </header>

  <div class="trust"><div class="wrap"><div class="row">
    <span class="item"><b>Our own systems in production</b>, not templates</span>
    <span class="item">From idea to agent in <span class="mono">&lt;48 h</span></span>
    <span class="item">Real support in <span class="mono">&lt;2 h</span></span>
    <span class="item">NIS2 <span class="mono">compliance</span> included</span>
  </div></div></div>`;

  const problema = !S.problema ? "" : `
  <section class="blk" id="problema"><div class="wrap">
    <p class="lbl rev">The problem</p>
    <h2 class="rev">Repetitive work is <em>holding your business back</em>.</h2>
    <p class="sec-lede rev">We hear it every week. It's not a headcount problem &mdash; the same tasks eat up everything.</p>
    <div class="quotes">
      <div class="quote rev"><div class="qm">&ldquo;</div><p>I review and classify hundreds of invoices by hand every month. A time sink.</p><div class="who mono">PROPERTY MANAGER</div></div>
      <div class="quote rev"><div class="qm">&ldquo;</div><p>Important emails pile up unanswered. Something always slips through.</p><div class="who mono">OPERATIONS &middot; SMB</div></div>
      <div class="quote rev"><div class="qm">&ldquo;</div><p>Detecting network incidents by hand leaves gaps and slow responses.</p><div class="who mono">IT &middot; INFRASTRUCTURE</div></div>
    </div>
    <p class="resolve rev"><span class="ar">&rarr;</span>You don't need to hire more. You need <b>it to happen on its own</b>.</p>
  </div></section>`;

  const servicios = !S.servicios ? "" : `
  <section class="blk" id="servicios"><div class="wrap">
    <p class="lbl rev">What we automate</p>
    <h2 class="rev">Fewer tasks for you. <em>More business.</em></h2>
    <p class="sec-lede rev">Every block is a real problem you stop touching. Connected to what you already use.</p>
    <div class="svc">
      <div class="cell rev"><div class="ic">&#8377;</div><h3>Invoices and admin</h3><p>Classify, validate, and log every invoice with no manual work. With a finance module.</p><div class="was">before: 2 days/month by hand</div></div>
      <div class="cell rev"><div class="ic">&#9993;</div><h3>Support and follow-up</h3><p>Categorizes emails, drafts replies, and creates tasks. Nothing slips through.</p><div class="was">before: inbox always full</div></div>
      <div class="cell rev"><div class="ic">&#9672;</div><h3>24/7 cybersecurity</h3><p>Monitors the network in real time, classifies threats, and alerts with a protocol.</p><div class="was">before: reviews with gaps</div></div>
      <div class="cell rev"><div class="ic">&#9881;</div><h3>IT operations</h3><p>Network, ERP, inventory, and alerts in a single panel, instead of six separate tools.</p><div class="was">before: six open tabs</div></div>
      <div class="cell rev"><div class="ic">&#8596;</div><h3>Integrations</h3><p>We connect the agent to your current systems &mdash; ERP, email, Google Workspace, Telegram.</p><div class="was">no migration needed</div></div>
      <div class="cell rev"><div class="ic">&#9671;</div><h3>Custom software</h3><p>When no off-the-shelf tool fits, we build it. In production, not in eternal beta.</p><div class="was">for your exact problem</div></div>
    </div>
  </div></section>`;

  const como = !S.como ? "" : `
  <section class="blk" id="como"><div class="wrap">
    <p class="lbl rev">Why us</p>
    <h2 class="rev">Real engineering, <em>co-founder treatment</em>.</h2>
    <div class="pillars">
      <div class="pillar rev"><div class="no">01</div><h3>We don't sell AI</h3><p>We sell your problem disappearing. Technology is the how; the result is what you pay for.</p></div>
      <div class="pillar rev"><div class="no">02</div><h3>In production, not in slides</h3><p>Everything you see already runs 24/7. No generic templates: technical rigor on your real case.</p></div>
      <div class="pillar rev"><div class="no">03</div><h3>From diagnostic to Monday</h3><p>You talk directly to whoever builds it. Live in 48h and real support in under 2h.</p></div>
    </div>
  </div></section>`;

  const productos = !S.productos ? "" : `
  <section class="blk" id="productos"><div class="wrap">
    <p class="lbl rev">Real cases</p>
    <h2 class="rev">Our own systems, <em>running right now</em>.</h2>
    <p class="sec-lede rev">These aren't demos: they're products in production. Proof that what we promise gets delivered.</p>
    <div class="neural">${prods}</div>
  </div></section>`;

  const foot = `
  <div class="foot"><div class="wrap">
    <div class="fcols">
      <div class="fbrand">
        <div class="brand"><span class="mk"></span> Praxia&nbsp;Labs</div>
        <p>Custom automation with AI agents. Our own systems in production — from Spain.</p>
      </div>
      <div class="fcol">
        <h3>Product</h3>
        <a href="/en/siam">SIAM</a><a href="/en/core-ops">Core OPS</a><a href="/en/adminapp">AdminApp</a><a href="/en/lab">Lab</a>
      </div>
      <div class="fcol">
        <h3>Praxia</h3>
        <a href="#servicios">What we automate</a><a href="#como">Why us</a><a href="/en/pricing">Pricing</a><a href="/about">About</a><a href="/contact">Contact</a>
      </div>
      <div class="fcol">
        <h3>Contact</h3>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><span>Free 15-min diagnostic</span><span>Live from Monday</span><a href="/privacy">Privacy policy</a>
      </div>
    </div>
    <div class="fbot"><span>&copy; ${new Date().getFullYear()} Praxia Labs</span><span class="mono">Made in Spain</span></div>
  </div></div>`;

  const secMap: Record<string, string> = { problema, servicios, como, productos };
  const styleVars = { "--cyan": cfg.accent, "--blue": cfg.accentBlue } as React.CSSProperties;

  return (
    <div lang="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      <noscript>
        <style>{`.lx .rev { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <HomeFx fx={{ enabled: cfg.effectsEnabled, bolt: cfg.bolt, thickness: cfg.thickness, length: cfg.length, sparkDensity: cfg.sparkDensity, sparkColors: cfg.sparkColors, starfield: cfg.starfield }} />
      <div className="lx" style={styleVars}>
        <div dangerouslySetInnerHTML={{ __html: hero }} />
        {cfg.sectionOrder.map((k) =>
          k === "contacto"
            ? (cfg.sections.contacto ? <ContactSectionEn key="contacto" /> : null)
            : (secMap[k] ? <div key={k} dangerouslySetInnerHTML={{ __html: secMap[k] }} /> : null),
        )}
        <div dangerouslySetInnerHTML={{ __html: foot }} />
      </div>
    </div>
  );
}

function ContactSectionEn() {
  return (
    <section className="blk final" id="contacto">
      <div className="glow2" />
      <div className="wrap">
        <p className="lbl rev" style={{ justifyContent: "center" }}>Start here</p>
        <h2 className="rev">
          Tell us what&apos;s eating your day. <em>We&apos;ll handle the rest.</em>
        </h2>
        <p className="rev" style={{ marginBottom: "24px" }}>
          15 minutes, no commitment. We&apos;ll tell you exactly what can be automated and how much time you get back.
        </p>
        <div className="contact-card rev">
          <ContactForm lang="en" />
        </div>
      </div>
    </section>
  );
}
