import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        // Verificar que está autenticado
        const token = request.cookies.get('jmr_session')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const session = await verifyToken(token);
        if (!session) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const { email, newPassword } = await request.json();

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json({ error: 'Contraseña muy corta' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await prisma.adminUser.update({
            where: { email },
            data: { passwordHash },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}