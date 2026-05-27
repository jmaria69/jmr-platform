import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Borra el usuario anterior si existe
        await prisma.adminUser.deleteMany({
            where: { email: 'admin@test.com' }
        });

        // Crea el hash
        const hashedPassword = await bcryptjs.hash('admin123', 10);

        // Crea el usuario
        const admin = await prisma.adminUser.create({
            data: {
                email: 'admin@test.com',
                name: 'Admin Test',
                passwordHash: hashedPassword,
                role: 'admin'
            }
        });

        console.log('✅ Usuario creado:', admin);
        console.log('📧 Email:', admin.email);
        console.log('🔑 Contraseña: admin123');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();