import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const admin = await prisma.adminUser.findUnique({
            where: { email: 'admin@test.com' }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Usuario no encontrado' });
        }

        console.log('Hash desde BD:', admin.passwordHash);
        console.log('Longitud:', admin.passwordHash.length);
        console.log('Primeros 20 chars:', admin.passwordHash.substring(0, 20));

        const testPassword = 'tu-contraseña-aquí'; // Cambia esto
        const result = await bcryptjs.compare(testPassword, admin.passwordHash);

        return NextResponse.json({
            email: admin.email,
            hashLength: admin.passwordHash.length,
            hashPreview: admin.passwordHash.substring(0, 30),
            compareResult: result,
            testPassword: testPassword
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}