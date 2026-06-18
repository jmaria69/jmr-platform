import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// Endpoint de aprovisionamiento de administradores.
// Controles ISO 27001 (A.8.2 acceso privilegiado / A.8.9 config segura):
//  - Deshabilitado en produccion (salvo ALLOW_SETUP=true).
//  - Requiere cabecera x-setup-secret == SETUP_SECRET.
//  - Nunca devuelve la contrasena en la respuesta.
export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_SETUP !== "true") {
        return new NextResponse("Not found", { status: 404 });
    }

    const setupSecret = process.env.SETUP_SECRET;
    if (!setupSecret || req.headers.get("x-setup-secret") !== setupSecret) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return NextResponse.json(
            { error: "ADMIN_PASSWORD no configurada" },
            { status: 400 }
        );
    }

    try {
        const hashedPassword = await hash(adminPassword, 12);

        const admin1 = await prisma.adminUser.upsert({
            where: { email: "admin@test.com" },
            update: { passwordHash: hashedPassword },
            create: {
                email: "admin@test.com",
                passwordHash: hashedPassword,
                name: "Admin Test",
                role: "admin",
            },
        });

        const admin2 = await prisma.adminUser.upsert({
            where: { email: "jmaria.romero@praxialabs.com" },
            update: { passwordHash: hashedPassword },
            create: {
                email: "jmaria.romero@praxialabs.com",
                passwordHash: hashedPassword,
                name: "Jose Maria",
                role: "admin",
            },
        });

        return NextResponse.json({
            message: "Admins sincronizados",
            admins: [admin1.email, admin2.email],
        });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 }
        );
    }
}
