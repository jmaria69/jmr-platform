import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { recordProjectView } from "@/lib/repositories";

const BOT_RE = /bot|crawler|spider|preview|facebookexternalhit|slackbot|whatsapp|telegram|linkedinbot/i;

/**
 * POST /api/projects/[id]/view — beacon de vista de proyecto.
 * Lo llama el cliente al abrir /proyectos/[id]. Público por diseño.
 * Filtra bots y guarda un hash anónimo de IP (nunca la IP en claro).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = request.headers.get("user-agent") || "";
  // No contamos crawlers para no inflar las métricas
  if (BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

  const referer = request.headers.get("referer") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ipHash = createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);

  await recordProjectView(id, { referer, userAgent: ua, ipHash });
  return new NextResponse(null, { status: 204 });
}
