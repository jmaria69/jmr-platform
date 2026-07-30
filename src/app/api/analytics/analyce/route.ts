import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request) {
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const cookies = Object.fromEntries(
            cookieHeader.split("; ").map((c) => {
                const [k, ...v] = c.split("=");
                return [k, v.join("=")];
            })
        );
        const token = cookies[SESSION_COOKIE];
        const session = token ? await verifyToken(token) : null;
        if (!session) {
            return Response.json({ error: "No autenticado" }, { status: 401 });
        }

        const { analyticsData } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return Response.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent(
            `Analiza: ${JSON.stringify(analyticsData)}`
        );

        return Response.json({ analysis: result.response.text() });
    } catch (error) {
        return Response.json({ error: String(error) }, { status: 500 });
    }
}