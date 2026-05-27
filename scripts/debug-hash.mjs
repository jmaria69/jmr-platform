import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function debug() {
    try {
        const admin = await prisma.adminUser.findUnique({
            where: { email: 'admin@test.com' }
        });

        if (!admin) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('\n📊 HASH EN BD:');
        console.log('Valor completo:', admin.passwordHash);
        console.log('Longitud:', admin.passwordHash.length);
        console.log('Primeros 30 chars:', admin.passwordHash.substring(0, 30));
        console.log('Últimos 10 chars:', admin.passwordHash.substring(admin.passwordHash.length - 10));

        console.log('\n🔐 PRUEBA DE COMPARE:');
        const testPassword = 'admin123'; // CAMBIA ESTO POR TU CONTRASEÑA REAL
        const result = await bcryptjs.compare(testPassword, admin.passwordHash);

        console.log('Password a probar:', testPassword);
        console.log('Resultado compare():', result);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debug();