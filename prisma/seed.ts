import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { generateSecret } from 'otplib';
import { NobleCryptoPlugin } from '@otplib/plugin-crypto-noble';

const prisma = new PrismaClient();

async function main() {
    // Configure otplib to use noble crypto
    // Note: In newer versions of otplib, the crypto plugin is automatically loaded
    // For safety, we'll just use the basic functions which should work

    const hashedPassword = await hash("admin123", 12);
    const secret = generateSecret();

    const admin = await prisma.adminUser.upsert({
        where: { email: "admin@test.com" },
        update: {
            totpEnabled: true,
            totpSecret: secret,
        },
        create: {
            email: "admin@test.com",
            passwordHash: hashedPassword,
            name: "Admin",
            role: "admin",
            totpEnabled: true,
            totpSecret: secret,
        },
    });

    console.log("✅ Admin creado:", admin);
    console.log(`\n🔐 2FA Secret for admin@test.com: ${secret}`);
    console.log(`🔗 Provisioning URI: otpauth://totp/Praxia Labs:admin@test.com?secret=${secret}&issuer=Praxia Labs`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });