import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import {
  findAllContacts,
  searchContacts,
  createContact,
  getCRMStats,
} from "@/lib/repositories";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/crm
 * Returns all contacts with optional search (requiere sesión admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");
    const includeStats = searchParams.get("stats") === "true";

    const contacts = query
      ? await searchContacts(query)
      : await findAllContacts();
    const meta = includeStats ? { stats: await getCRMStats() } : undefined;

    return apiSuccess(contacts, meta);
  } catch {
    return apiServerError();
  }
}

/**
 * POST /api/crm
 * Creates a new contact (requiere sesión admin)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const body = await request.json();

    const errors: string[] = [];
    if (!body.name?.trim()) errors.push("name es obligatorio");
    if (!body.email?.trim()) errors.push("email es obligatorio");
    if (!body.stage) errors.push("stage es obligatorio");

    if (errors.length > 0) {
      return apiBadRequest("Datos de contacto inválidos", { fields: errors });
    }

    const contact = await createContact({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      company: body.company?.trim() || undefined,
      source: body.source || "direct",
      stage: body.stage,
      value: body.value || 0,
      notes: body.notes?.trim() || "",
      tags: body.tags || [],
      lastContact: new Date(),
    });

    return apiCreated(contact);
  } catch {
    return apiServerError();
  }
}
