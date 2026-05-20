/**
 * /api/security/alert — receives attack events from proxy and:
 *  1. Stores them in the in-memory event log
 *  2. Sends an email alert via EmailJS REST API when thresholds are exceeded
 */

import { NextRequest, NextResponse } from "next/server";

// ─── In-memory event store (per serverless instance, best-effort) ──────────────
export interface SecurityEvent {
  id: string;
  type: "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious";
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  details: string;
  resolved: boolean;
}

// Global store — survives warm lambda restarts
const events: SecurityEvent[] = (globalThis as any).__sec_events ?? [];
(globalThis as any).__sec_events = events;

const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const EMAIL_COOLDOWN_MS = 5 * 60 * 1000; // Don't spam — max 1 email per 5 min
let lastEmailSentAt = 0;

// ─── Email via EmailJS REST API ────────────────────────────────────────────────
async function sendAlertEmail(event: SecurityEvent): Promise<void> {
  const now = Date.now();
  if (now - lastEmailSentAt < EMAIL_COOLDOWN_MS) return;

  const publicKey  = process.env.EMAILJS_PUBLIC_KEY;
  const serviceId  = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_SECURITY_TEMPLATE;

  if (!publicKey || !serviceId || !templateId) return;

  const severityEmoji = { low: "🟡", medium: "🟠", high: "🔴", critical: "🚨" }[event.severity];
  const typeLabels: Record<string, string> = {
    bot_blocked:    "Bot / Agente IA bloqueado",
    rate_limited:   "Fuerza bruta / Rate limit",
    invalid_token:  "Token JWT inválido o expirado",
    brute_force:    "Intento de fuerza bruta",
    suspicious:     "Actividad sospechosa",
  };

  const solutions: Record<string, string> = {
    bot_blocked:   "El bot fue bloqueado automáticamente por detección de User-Agent. No se requiere acción inmediata.",
    rate_limited:  "IP bloqueada durante 15 minutos. Si persiste, considera añadir esta IP a la lista negra permanente.",
    invalid_token: "Posible intento de falsificación de sesión (JWT manipulation). Revisa si hay sesiones activas no autorizadas.",
    brute_force:   "URGENTE: Múltiples intentos fallidos de login. Considera cambiar la contraseña de admin inmediatamente.",
    suspicious:    "Actividad anómala detectada. Revisa los logs completos en el panel de seguridad.",
  };

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  serviceId,
        template_id: templateId,
        user_id:     publicKey,
        template_params: {
          severidad:     `${severityEmoji} ${event.severity.toUpperCase()}`,
          tipo_ataque:   typeLabels[event.type] || event.type,
          ip_atacante:   event.ip,
          ruta:          event.path,
          user_agent:    event.userAgent.slice(0, 120),
          fecha_hora:    new Date(event.timestamp).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }),
          detalles:      event.details,
          solucion:      solutions[event.type] || "Revisa el panel de seguridad para más detalles.",
          total_eventos: String(events.length),
          panel_url:     "https://web-orcin-nine-90.vercel.app/admin/seguridad",
          to_email:      "jmaria.romero79@gmail.com",
        },
      }),
    });
    lastEmailSentAt = now;
  } catch {
    // Email failure is silent — don't crash the security pipeline
  }
}

// ─── Route handlers ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Validate internal secret to prevent abuse of this endpoint
  const secret = req.headers.get("x-security-secret");
  if (secret !== process.env.SECURITY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as Partial<SecurityEvent>;

  // Track brute force pattern per IP
  const ip = body.ip ?? "unknown";
  const ipRecord = rateLimitMap.get(ip) ?? { count: 0, firstSeen: Date.now() };
  ipRecord.count++;
  rateLimitMap.set(ip, ipRecord);

  // Escalate severity for repeated offenders
  let severity = body.severity ?? "medium";
  if (ipRecord.count >= 10) severity = "critical";
  else if (ipRecord.count >= 5) severity = "high";

  const event: SecurityEvent = {
    id:        `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type:      body.type ?? "suspicious",
    ip,
    path:      body.path ?? "/",
    userAgent: body.userAgent ?? "",
    timestamp: new Date().toISOString(),
    severity,
    details:   body.details ?? "",
    resolved:  false,
  };

  // Keep last 200 events
  events.unshift(event);
  if (events.length > 200) events.splice(200);

  // Send email for medium+ severity
  if (["medium","high","critical"].includes(severity)) {
    sendAlertEmail(event); // fire-and-forget
  }

  return NextResponse.json({ ok: true, id: event.id });
}

export async function GET(req: NextRequest) {
  // Only accessible with valid admin session (proxy guards the route)
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
  const type  = req.nextUrl.searchParams.get("type");

  let filtered = type ? events.filter(e => e.type === type) : events;
  filtered = filtered.slice(0, limit);

  const stats = {
    total:    events.length,
    critical: events.filter(e => e.severity === "critical").length,
    high:     events.filter(e => e.severity === "high").length,
    medium:   events.filter(e => e.severity === "medium").length,
    low:      events.filter(e => e.severity === "low").length,
    byType: {
      bot_blocked:   events.filter(e => e.type === "bot_blocked").length,
      rate_limited:  events.filter(e => e.type === "rate_limited").length,
      invalid_token: events.filter(e => e.type === "invalid_token").length,
      brute_force:   events.filter(e => e.type === "brute_force").length,
      suspicious:    events.filter(e => e.type === "suspicious").length,
    },
    topIPs: [...rateLimitMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([ip, r]) => ({ ip, count: r.count })),
  };

  return NextResponse.json({ events: filtered, stats });
}

export async function PATCH(req: NextRequest) {
  // Mark event as resolved
  const { id } = await req.json();
  const ev = events.find(e => e.id === id);
  if (ev) ev.resolved = true;
  return NextResponse.json({ ok: true });
}
