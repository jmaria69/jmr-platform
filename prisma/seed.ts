import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash("admin123", 12);

    const admin = await prisma.adminUser.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            passwordHash: hashedPassword,
            name: "Admin",
            role: "admin",
        },
    });

    console.log("✅ Admin creado:", admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });