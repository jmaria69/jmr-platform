import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { findCampaignBySlug, recordClick } from "@/lib/repositories";

/**
 * GET /c/[slug] — enlace corto de campaña.
 * Registra el click (referer, user-agent, hash anónimo de IP) y redirige
 * al destino con los UTM de la campaña. Público por diseño: es el enlace
 * que se comparte en LinkedIn, emails, etc.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await findCampaignBySlug(slug);

  // Slug desconocido o campaña finalizada → a la home, sin dar pistas
  if (!campaign || campaign.status === "finalizada") {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // No contamos crawlers para no inflar las métricas
  const isBot = /bot|crawler|spider|preview|facebookexternalhit|slackbot|whatsapp|telegram|linkedinbot/i.test(ua);
  if (!isBot) {
    // Hash anónimo: nunca guardamos la IP en claro
    const ipHash = createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
    await recordClick(campaign.id, { referer, userAgent: ua, ipHash });
  }

  const url = new URL(campaign.targetUrl);
  if (campaign.utmSource) url.searchParams.set("utm_source", campaign.utmSource);
  if (campaign.utmMedium) url.searchParams.set("utm_medium", campaign.utmMedium);
  if (campaign.utmCampaign) url.searchParams.set("utm_campaign", campaign.utmCampaign);

  return NextResponse.redirect(url.toString(), 302);
}
