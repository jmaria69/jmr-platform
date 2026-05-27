import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function testCompare() {
    try {
        const admin = await prisma.adminUser.findUnique({
            where: { email: 'admin@test.com' }
        });

        console.log('\n📊 USUARIO EN BD:');
        console.log('Hash almacenado:', admin.passwordHash);
        console.log('Tipo:', typeof admin.passwordHash);
        console.log('Longitud:', admin.passwordHash.length);

        const testPassword = 'admin123';
        console.log('\n🔑 PROBANDO COMPARE:');
        console.log('Contraseña a probar:', testPassword);

        const result = await bcryptjs.compare(testPassword, admin.passwordHash);
        console.log('Resultado:', result);

        if (!result) {
            console.log('\n❌ COMPARE FALLÓ');
            console.log('El hash parece correcto pero compare() devuelve false');
        } else {
            console.log('\n✅ COMPARE FUNCIONÓ');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testCompare();