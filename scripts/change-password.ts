import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ═══════════════════════════════════════════════════════════════
  // CAMBIA AQUÍ LA NUEVA CONTRASEÑA
  // ═══════════════════════════════════════════════════════════════
  const NUEVA_CONTRASEÑA = "AquiTuNuevaContraseña123#@";
  const EMAIL = "jmaria.romero@praxialabs.com";
  // ═══════════════════════════════════════════════════════════════

  const newHash = await hash(NUEVA_CONTRASEÑA, 12);

  // Actualizar en LOCAL
  await prisma.adminUser.update({
    where: { email: EMAIL },
    data: { passwordHash: newHash },
  });
  console.log("✅ Contraseña actualizada en LOCAL");

  await prisma.$disconnect();

  // Actualizar en PRODUCCIÓN (Neon)
  const prismaProd = new PrismaClient({
    datasourceUrl:
      "postgresql://neondb_owner:npg_34DoCRuZAsqB@ep-blue-feather-al1k17wn-pooler.c-3.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  });

  await prismaProd.adminUser.update({
    where: { email: EMAIL },
    data: { passwordHash: newHash },
  });
  console.log("✅ Contraseña actualizada en PRODUCCIÓN");

  await prismaProd.$disconnect();

  console.log(`\n🔐 Nueva contraseña para ${EMAIL}:`);
  console.log(NUEVA_CONTRASEÑA);
}

main();