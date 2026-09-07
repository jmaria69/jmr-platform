import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.adminUser.update({
    where: { email: 'jmaria.romero@praxialabs.com' },
    data: {
      totpEnabled: true,
      totpSecret: 'FQQRR73LSEBYBNXJE6B3362RIQHVT2IS',
    },
  });
  console.log('✅ 2FA habilitado para:', updated.email);
  console.log('Secret:', updated.totpSecret);
  await prisma.$disconnect();
}

main();
