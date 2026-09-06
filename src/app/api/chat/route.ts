import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PRAXIA_SYSTEM_PROMPT = `
Eres Praxia Assist, el asistente virtual oficial de Praxia Labs (estudio de automatización con IA para pymes en España, https://praxialabs.com).
Tono: profesional, cercano, directo y conciso.

Planes y Precios oficiales:
- Plan Esencial: 950 €/mes (o 760 €/mes anual). 1 agente IA, 1 proceso automatizado, email/Workspace, soporte <24h.
- Plan Profesional: 1.800 €/mes (o 1.440 €/mes anual). Hasta 3 agentes IA, 3 procesos, ERP/CRM/APIs custom, soporte prioritario <2h.
- Plan Enterprise: 3.200 €/mes (o 2.560 €/mes anual). Agentes/procesos ilimitados, SAP/Oracle, multi-tenant, SLA 24/7.
Sin permanencia. Setup incluido en el 1er mes.

Tiempos de entrega:
- Una web o automatización estándar está lista y en producción en 48 horas a 1 semana.
- Integraciones complejas con ERP/CRM a medida: 2 a 3 semanas.

Responde siempre en español, de forma breve y clara para chat.
`;

export async function POST(req: Request) {
  try {
    const { telefono, mensaje } = await req.json();

    if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
      return NextResponse.json({ respuesta: "" });
    }

    const agentBackendUrl =
      process.env.AGENT_BACKEND_URL ||
      process.env.NEXT_PUBLIC_AGENT_URL ||
      "http://127.0.0.1:8010";

    // 1. Intentar llamar al backend dedicado whatsapp-agent-praxialabs
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const agentRes = await fetch(`${agentBackendUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({
          telefono: telefono || "web-client",
          mensaje: mensaje.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (agentRes.ok) {
        const data = await agentRes.json();
        if (data.respuesta) {
          return NextResponse.json({ respuesta: data.respuesta });
        }
      }
    } catch (backendError) {
      console.warn("Backend whatsapp-agent-praxialabs no disponible, intentando fallback:", backendError);
    }

    // 2. Fallback con Gemini si está configurado en Vercel
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: PRAXIA_SYSTEM_PROMPT,
        });

        const result = await model.generateContent(mensaje);
        const text = result.response.text();
        if (text) {
          return NextResponse.json({ respuesta: text.trim() });
        }
      } catch (geminiError) {
        console.error("Error en fallback de Gemini:", geminiError);
      }
    }

    // 3. Fallback de respuesta básica
    return NextResponse.json({
      respuesta:
        "¡Hola! Una automatización o agente estándar suele estar operativa en 48h a 1 semana. ¿En qué proceso te gustaría que te ayudemos?",
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { respuesta: "Lo siento, ha ocurrido un error temporal. Por favor, inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
