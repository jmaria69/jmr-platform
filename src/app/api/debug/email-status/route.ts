import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceId = !!process.env.EMAILJS_SERVICE_ID;
  const templateId = !!process.env.EMAILJS_SECURITY_TEMPLATE;
  const publicKey = !!process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = !!process.env.EMAILJS_PRIVATE_KEY;
  const configured = serviceId && templateId && publicKey && privateKey;

  return NextResponse.json({
    emailjs: {
      serviceId: serviceId,
      templateId: templateId,
      publicKey: publicKey,
      privateKey: privateKey,
      configured: configured,
    },
    // Also check if next public flag is set
    nextPublicEmailConfigured: process.env.NEXT_PUBLIC_EMAIL_CONFIGURED === "true",
  });
}

export const dynamic = "force-dynamic";