import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
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
            message: "✅ Admins sincronizados",
            admins: [admin1.email, admin2.email],
            password: adminPassword,
        });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 }
        );
    }
}