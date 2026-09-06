import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('Connected:', result)
  } catch (e) {
    console.error('Connection error:', e)
  } finally {
    await prisma.$disconnect()
  }
}
main()