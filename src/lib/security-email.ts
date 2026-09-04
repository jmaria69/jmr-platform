import type { SecurityEvent } from "@/lib/security-store";

// Envía la alerta por email vía EmailJS (REST API, uso server-side con
// accessToken privado -- ver https://www.emailjs.com/docs/rest-api/send/).
// El template "template_security" ya define el destinatario en el propio
// dashboard de EmailJS; aquí solo se rellenan las variables documentadas
// en el panel /admin/seguridad: severidad, tipo_ataque, ip_atacante,
// fecha_hora, detalles, solucion, panel_url.
const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

const SEVERITY_LABEL: Record<SecurityEvent["severity"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

const TYPE_LABEL: Record<SecurityEvent["type"], string> = {
  bot_blocked: "Bot bloqueado",
  rate_limited: "Fuerza bruta (rate limit)",
  invalid_token: "Token inválido",
  brute_force: "Ataque de fuerza bruta",
  suspicious: "Actividad sospechosa",
  waf_blocked: "WAF Cloudflare (edge)",
};

const SOLUTION_SUMMARY: Record<SecurityEvent["type"], string> = {
  bot_blocked: "Bloqueado automáticamente con HTTP 403. No requiere acción inmediata.",
  rate_limited: "IP bloqueada 15 min. Si persiste, bloquéala en Vercel Firewall y revisa la fortaleza de la contraseña de admin.",
  invalid_token: "Posible session hijacking. Si el volumen es alto, rota AUTH_SECRET desde Vercel.",
  brute_force: "URGENTE: cambia la contraseña de admin y bloquea la IP en Vercel Firewall.",
  suspicious: "Revisa el contexto del evento y el historial de la IP.",
  waf_blocked: "Ya bloqueado en el edge de Cloudflare. Revisa si la misma IP insiste.",
};

export async function sendSecurityAlertEmail(event: SecurityEvent): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_SECURITY_TEMPLATE;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  // Integración opcional -- igual que fetchCloudflareWafEvents, nunca debe
  // tumbar la creación del evento si no está configurada o falla.
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn("[security-email] EmailJS no configurado, alerta omitida");
    return;
  }

  const panelUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://praxialabs.com"}/admin/seguridad`;

  try {
    const res = await fetch(EMAILJS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          severidad: SEVERITY_LABEL[event.severity],
          tipo_ataque: TYPE_LABEL[event.type],
          ip_atacante: event.ip,
          fecha_hora: new Date(event.timestamp).toLocaleString("es-ES"),
          detalles: event.details || event.path,
          solucion: SOLUTION_SUMMARY[event.type],
          panel_url: panelUrl,
        },
      }),
    });
    if (!res.ok) {
      console.error("[security-email] EmailJS respondió con error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[security-email]", err instanceof Error ? err.message : String(err));
  }
}
