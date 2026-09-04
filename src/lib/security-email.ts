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

const ATTACK_SUMMARY: Record<SecurityEvent["type"], string> = {
  bot_blocked: "Bot detectado y bloqueado automáticamente antes de llegar a la aplicación.",
  rate_limited: "Múltiples intentos de login fallidos que activaron el límite de peticiones.",
  invalid_token: "Se recibió un token de sesión inválido o manipulado.",
  brute_force: "Intentos repetidos de adivinar la contraseña de administrador.",
  suspicious: "Actividad que no encaja en los patrones normales de uso.",
  waf_blocked: "Cloudflare bloqueó la petición en el edge antes de que llegara al servidor.",
};

const SOLUTION_STEPS: Record<SecurityEvent["type"], string[]> = {
  bot_blocked: [
    "No requiere acción manual, ya está bloqueado.",
    "Si se repite mucho desde la misma IP, añádela a la lista negra de Cloudflare.",
  ],
  rate_limited: [
    "La IP ya está bloqueada 15 minutos automáticamente.",
    "Si el ataque persiste tras el bloqueo, añade la IP en Vercel Firewall.",
    "Revisa que la contraseña de admin sea fuerte y única.",
  ],
  invalid_token: [
    "Revisa si el volumen de eventos es puntual o sostenido.",
    "Si es sostenido, rota AUTH_SECRET desde las variables de entorno en Vercel.",
    "Al rotar el secreto se invalidan todas las sesiones activas (los admins deberán volver a iniciar sesión).",
  ],
  brute_force: [
    "URGENTE: cambia la contraseña de admin ahora mismo.",
    "Bloquea la IP atacante en Vercel Firewall.",
    "Revisa el histórico de esa IP en el panel para confirmar si llegó a acceder.",
  ],
  suspicious: [
    "Revisa el detalle del evento y la ruta accedida.",
    "Consulta el historial de esa IP en el panel.",
    "Si se repite, bloquéala manualmente.",
  ],
  waf_blocked: [
    "Ya está bloqueado, no requiere acción inmediata.",
    "Si la misma IP insiste con otros vectores, añádela a la lista negra de Cloudflare.",
  ],
};

function formatSteps(type: SecurityEvent["type"]): string {
  return SOLUTION_STEPS[type].map((step, i) => `${i + 1}. ${step}`).join("\n");
}

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
          resumen: ATTACK_SUMMARY[event.type],
          detalles: event.details || event.path,
          solucion: formatSteps(event.type),
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
