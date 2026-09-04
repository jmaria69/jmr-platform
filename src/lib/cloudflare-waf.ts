import type { SecurityEvent } from "@/lib/security-store";

// Trae los bloqueos reales del WAF de Cloudflare (edge) para fusionarlos con
// los eventos que genera src/proxy.ts (nivel aplicación, ver
// src/app/api/security/events/route.ts). Son dos capas de seguridad
// distintas -- el WAF de Cloudflare bloquea la petición ANTES de que llegue
// a Vercel/Next.js, así que proxy.ts nunca la ve. Sin esto, admin/seguridad
// mostraba "sin ataques" aunque Cloudflare estuviera bloqueando cosas reales
// (detectado 2026-09-04 con un intento de RCE, CVE-2025-55182, que el WAF
// gestionado de Cloudflare paró pero que no aparecía aquí).
//
// Usa la GraphQL Analytics API (no hay endpoint REST para esto) --
// firewallEventsAdaptive, el mismo dataset que ve el dashboard Security de
// Cloudflare. Requiere el mismo CLOUDFLARE_API_TOKEN/CLOUDFLARE_ZONE_ID que
// usa SIAM (siem/cloudflare_firewall.py) -- el token ya tiene permiso de
// lectura suficiente (verificado a mano, no hace falta permiso extra).
const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

interface CfFirewallEvent {
  action: string;
  clientIP: string;
  clientRequestPath: string;
  clientRequestHTTPHost: string;
  datetime: string;
  ruleId: string;
  source: string;
  userAgent?: string;
}

function severityFor(source: string): SecurityEvent["severity"] {
  // firewallManaged = firma conocida de Cloudflare (RCE, SQLi, XSS...) --
  // lo más grave. firewallCustom = nuestra propia regla de hardening
  // (path traversal / archivos sensibles, ver siem/cloudflare_firewall.py y
  // el incidente 2026-09-04). El resto (rate limiting propio de Cloudflare,
  // bot fight mode...) se queda en medio.
  if (source === "firewallManaged") return "critical";
  if (source === "firewallCustom") return "high";
  return "medium";
}

function detailsFor(ev: CfFirewallEvent): string {
  const host = ev.clientRequestHTTPHost || "praxialabs.com";
  const originLabel =
    ev.source === "firewallManaged" ? "regla gestionada de Cloudflare (firma conocida de ataque)"
    : ev.source === "firewallCustom" ? "regla custom de hardening (SIAM Active Defense)"
    : `origen ${ev.source}`;
  return `Bloqueado en el edge de Cloudflare por ${originLabel} -- ${ev.action.toUpperCase()} ${host}${ev.clientRequestPath} (regla ${ev.ruleId})`;
}

export async function fetchCloudflareWafEvents(sinceISO: string, limit = 50): Promise<SecurityEvent[]> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zoneId) return []; // integración opcional -- nunca debe tumbar el panel

  const nowISO = new Date().toISOString();
  const query = `
    query {
      viewer {
        zones(filter: {zoneTag: "${zoneId}"}) {
          firewallEventsAdaptive(
            filter: {datetime_geq: "${sinceISO}", datetime_leq: "${nowISO}"}
            limit: ${limit}
            orderBy: [datetime_DESC]
          ) {
            action
            clientIP
            clientRequestPath
            clientRequestHTTPHost
            datetime
            ruleId
            source
            userAgent
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${CLOUDFLARE_API_BASE}/graphql`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      // No cachear -- son eventos de seguridad, siempre se quiere el dato fresco.
      cache: "no-store",
    });
    const data = await res.json();
    const events: CfFirewallEvent[] = data?.data?.viewer?.zones?.[0]?.firewallEventsAdaptive ?? [];

    // action !== "block" (challenge/log/skip) no es un ataque parado de
    // verdad -- se descarta para no meter ruido.
    return events
      .filter((ev) => ev.action === "block")
      .map((ev) => ({
        // Id determinista (no timestamp aleatorio): el mismo evento de
        // Cloudflare siempre genera el mismo id, así que refrescar el panel
        // cada 10s no duplica entradas.
        id: `cf-${ev.datetime}-${ev.clientIP}-${ev.ruleId}`,
        type: "waf_blocked" as const,
        ip: ev.clientIP,
        path: ev.clientRequestPath,
        userAgent: (ev.userAgent ?? "").slice(0, 200),
        timestamp: ev.datetime,
        severity: severityFor(ev.source),
        details: detailsFor(ev),
        resolved: false,
      }));
  } catch (err) {
    console.error("[fetchCloudflareWafEvents]", err instanceof Error ? err.message : String(err));
    return []; // igual que sin token -- una integración opcional nunca tumba el panel
  }
}
