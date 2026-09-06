import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Try to query the admin_users table to see its structure
    const columns = await prisma.$queryRaw<
      Array<{ column_name: string; data_type: string; is_nullable: string }>
    >`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'admin_users'
      ORDER BY ordinal_position;
    `;

    console.log("Columns in admin_users:");
    columns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });

    // Also try to see if the table exists at all
    const tableExists = await prisma.$queryRaw<
      Array<{ exists: boolean }>
    >`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'admin_users'
      ) AS exists;
    `;

    console.log(`Table admin_users exists: ${tableExists[0].exists}`);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();