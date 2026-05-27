import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";

// Carga variables de .env.local
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        throw new Error(
            "ADMIN_PASSWORD no definida en .env.local. Agrega: ADMIN_PASSWORD=tucontraseña"
        );
    }

    const hashedPassword = await hash(adminPassword, 12);

    // Admin de prueba
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

    // Tu admin
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

    console.log("✅ Admins sincronizados:");
    console.log("  - admin@test.com");
    console.log("  - jmaria.romero@praxialabs.com");
    console.log(`✅ Contraseña: ${adminPassword}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });