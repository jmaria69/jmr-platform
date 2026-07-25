/**
 * Agente de marketing — FASE 1 (Observador)
 * ------------------------------------------------------------------
 * Cada mañana: lee GA4, compara con la semana anterior, saca insights
 * y envía un informe por email (Resend). NO toca dinero ni campañas.
 *
 * Uso:
 *   node --env-file=.env.local scripts/marketing-report.mjs --dry   (imprime)
 *   node --env-file=.env.local scripts/marketing-report.mjs         (envía)
 *
 * Env: GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, GA_PROPERTY_ID, RESEND_API_KEY
 *      MARKETING_REPORT_TO (destinatario), MARKETING_FROM (opcional)
 */
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { Resend } from "resend";

const DRY = process.argv.includes("--dry");
const PROPERTY = process.env.GA_PROPERTY_ID;
const FROM = process.env.MARKETING_FROM || "noreply@praxialabs.com";
const TO = process.env.MARKETING_REPORT_TO || "jmaria.romero@praxialabs.com";

function gaClient() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!b64) throw new Error("Falta GOOGLE_SERVICE_ACCOUNT_KEY_BASE64");
  if (!PROPERTY) throw new Error("Falta GA_PROPERTY_ID");
  const credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  return new BetaAnalyticsDataClient({ credentials });
}

async function totals(c, startDate, endDate) {
  const [r] = await c.runReport({
    property: `properties/${PROPERTY}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" },
      { name: "bounceRate" }, { name: "averageSessionDuration" },
    ],
  });
  const v = r.rows?.[0]?.metricValues ?? [];
  const n = (i) => parseFloat(v[i]?.value ?? "0") || 0;
  return { users: n(0), sessions: n(1), views: n(2), bounce: n(3), avgDur: n(4) };
}

async function topBy(c, dimension, startDate, endDate, limit = 5) {
  const [r] = await c.runReport({
    property: `properties/${PROPERTY}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit,
  });
  return (r.rows ?? []).map((x) => ({
    key: x.dimensionValues?.[0]?.value ?? "(desconocido)",
    users: parseInt(x.metricValues?.[0]?.value ?? "0", 10),
  }));
}

const pct = (now, prev) => (prev > 0 ? Math.round(((now - prev) / prev) * 100) : (now > 0 ? 100 : 0));
const arrow = (d) => (d > 0 ? "▲" : d < 0 ? "▼" : "=");
const mmss = (s) => `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;

/** Insights por heurística (sin IA). Con ANTHROPIC_API_KEY se puede enriquecer. */
function insights({ cur, prev, channels, pages }) {
  const out = [];
  const dUsers = pct(cur.users, prev.users);

  if (cur.users < 50) {
    out.push(`Volumen bajo (${cur.users} usuarios/7d): las variaciones aún no son estadísticamente fiables. Prioriza captación antes que optimización.`);
  }
  if (dUsers >= 15) out.push(`Crecimiento del ${dUsers}% en usuarios frente a la semana anterior. Identifica qué cambió y dóblalo.`);
  if (dUsers <= -15) out.push(`Caída del ${Math.abs(dUsers)}% en usuarios. Revisa si bajó algún canal concreto (tabla de canales).`);

  if (channels.length) {
    const top = channels[0];
    const share = cur.users > 0 ? Math.round((top.users / cur.users) * 100) : 0;
    out.push(`Canal principal: <b>${top.key}</b> (${top.users} usuarios, ${share}% del total).`);
    if (share >= 70) out.push(`Dependes demasiado de un solo canal (${share}%). Diversificar reduce riesgo.`);
  }
  if (pages.length) {
    out.push(`Contenido que más atrae: <b>${pages[0].key}</b> (${pages[0].users} usuarios). Es tu mejor candidato para ampliar o convertir en anuncio.`);
  }
  if (cur.bounce > 60) out.push(`Rebote alto (${cur.bounce.toFixed(0)}%): la página de entrada no está cumpliendo lo que promete el enlace.`);
  if (cur.avgDur > 120) out.push(`Sesión media de ${mmss(cur.avgDur)} — buena señal de calidad de audiencia.`);

  if (!out.length) out.push("Sin señales relevantes esta semana.");
  return out;
}

function rows(list, total) {
  if (!list.length) return `<tr><td colspan="2" style="padding:8px;color:#888">Sin datos</td></tr>`;
  return list.map((x) => {
    const share = total > 0 ? Math.round((x.users / total) * 100) : 0;
    return `<tr><td style="padding:6px 10px;border-top:1px solid #eee">${x.key}</td>
      <td style="padding:6px 10px;border-top:1px solid #eee;text-align:right"><b>${x.users}</b> <span style="color:#888">(${share}%)</span></td></tr>`;
  }).join("");
}

function buildHtml({ cur, prev, channels, pages, countries, tips }) {
  const kpi = (label, val, d, suffix = "") => `
    <td style="padding:12px 14px;background:#f7f8f7;border-radius:10px;vertical-align:top">
      <div style="font-size:11px;color:#5e6b64;text-transform:uppercase;letter-spacing:.08em">${label}</div>
      <div style="font-size:22px;font-weight:600;color:#18211d;margin-top:4px">${val}${suffix}</div>
      <div style="font-size:12px;color:${d > 0 ? "#0e7c6b" : d < 0 ? "#b23b34" : "#8b958f"};margin-top:2px">${arrow(d)} ${Math.abs(d)}% vs semana previa</div>
    </td>`;

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#18211d">
    <p style="font-family:monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#0e7c6b;margin:0 0 6px">Praxia Labs · Informe diario</p>
    <h1 style="font-size:24px;margin:0 0 4px">Marketing — últimos 7 días</h1>
    <p style="color:#5e6b64;font-size:14px;margin:0 0 20px">Comparado con los 7 días anteriores.</p>

    <table style="width:100%;border-spacing:8px 0"><tr>
      ${kpi("Usuarios", cur.users, pct(cur.users, prev.users))}
      ${kpi("Sesiones", cur.sessions, pct(cur.sessions, prev.sessions))}
      ${kpi("Rebote", cur.bounce.toFixed(0), pct(cur.bounce, prev.bounce), "%")}
    </tr></table>
    <p style="font-size:13px;color:#5e6b64;margin:14px 0 24px">Sesión media: <b>${mmss(cur.avgDur)}</b> · Páginas vistas: <b>${cur.views}</b></p>

    <h2 style="font-size:15px;margin:0 0 8px">Qué recomiendo</h2>
    <ul style="font-size:14px;line-height:1.7;padding-left:18px;margin:0 0 24px">
      ${tips.map((t) => `<li>${t}</li>`).join("")}
    </ul>

    <h2 style="font-size:15px;margin:0 0 8px">Canales</h2>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px">${rows(channels, cur.users)}</table>

    <h2 style="font-size:15px;margin:0 0 8px">Páginas más vistas</h2>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px">${rows(pages, cur.users)}</table>

    <h2 style="font-size:15px;margin:0 0 8px">Países</h2>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:24px">${rows(countries, cur.users)}</table>

    <p style="font-size:11px;color:#8b958f;border-top:1px solid #eee;padding-top:14px">
      Fase 1 (observador): solo lectura y recomendaciones. No modifica campañas ni presupuestos.
    </p>
  </div>`;
}

async function main() {
  const c = gaClient();
  const [cur, prev, channels, pages, countries] = await Promise.all([
    totals(c, "7daysAgo", "today"),
    totals(c, "14daysAgo", "8daysAgo"),
    topBy(c, "sessionDefaultChannelGroup", "7daysAgo", "today"),
    topBy(c, "pagePath", "7daysAgo", "today"),
    topBy(c, "country", "7daysAgo", "today"),
  ]);

  const tips = insights({ cur, prev, channels, pages });
  const html = buildHtml({ cur, prev, channels, pages, countries, tips });
  const subject = `Praxia · Marketing 7d: ${cur.users} usuarios (${arrow(pct(cur.users, prev.users))}${Math.abs(pct(cur.users, prev.users))}%)`;

  console.log(`\n${subject}`);
  console.log(`Usuarios ${cur.users} (prev ${prev.users}) · Sesiones ${cur.sessions} · Rebote ${cur.bounce.toFixed(0)}% · Sesión ${mmss(cur.avgDur)}`);
  console.log("Canales:", channels.map((x) => `${x.key}=${x.users}`).join(", ") || "-");
  console.log("Páginas:", pages.map((x) => `${x.key}=${x.users}`).join(", ") || "-");
  console.log("\nRecomendaciones:");
  tips.forEach((t) => console.log(" -", t.replace(/<[^>]+>/g, "")));

  if (DRY) {
    console.log("\n[--dry] No se envía email.");
    return;
  }
  if (!process.env.RESEND_API_KEY) throw new Error("Falta RESEND_API_KEY");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM, to: TO, subject, html });
  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
  console.log(`\n✅ Informe enviado a ${TO}`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
