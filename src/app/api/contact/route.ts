import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
    nombre: z.string().min(2, 'Nombre requerido'),
    email: z.string().email('Email invalido'),
    empresa: z.string().optional(),
    proyecto: z.string().min(1, 'Selecciona un proyecto'),
    mensaje: z.string().min(10, 'Mensaje muy corto'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = contactSchema.parse(body);

        // Guardar en BD
        await prisma.contact.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                empresa: data.empresa || '',
                proyecto: data.proyecto,
                mensaje: data.mensaje,
            },
        });

        // Enviar emails
        await resend.emails.send({
            from: 'noreply@praxialabs.com',
            to: data.email,
            subject: 'Recibimos tu mensaje - Praxia Labs',
            html: `<h2>Hola ${data.nombre},</h2><p>Gracias por contactarnos. Nos pondremos en contacto pronto.</p>`,
        });

        await resend.emails.send({
            from: 'noreply@praxialabs.com',
            to: 'jmaria.romero@praxialabs.com',
            subject: `Nuevo contacto: ${data.nombre}`,
            html: `<h3>Nuevo contacto</h3><p><strong>Nombre:</strong> ${data.nombre}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Proyecto:</strong> ${data.proyecto}</p><p><strong>Mensaje:</strong> ${data.mensaje.replace(/\n/g, '<br>')}</p>`,
        });

        return NextResponse.json({ success: true, message: 'Mensaje enviado' }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.issues[0]?.message || 'Validacion fallida' },
                { status: 400 }
            );
        }

        console.error('Error:', error);
        return NextResponse.json(
            { success: false, message: 'Error al enviar. Intenta de nuevo.' },
            { status: 500 }
        );
    }
}