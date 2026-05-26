import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

const contactSchema = z.object({
    nombre: z.string().min(2, 'Nombre requerido'),
    email: z.string().email('Email inválido'),
    empresa: z.string().optional(),
    proyecto: z.string().min(1, 'Selecciona un proyecto'),
    mensaje: z.string().min(10, 'Mensaje muy corto'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = contactSchema.parse(body);

        // Email al cliente
        const { error: clientEmailError } = await resend.emails.send({
            from: 'Praxia Labs <noreply@praxialabs.com>',
            to: data.email,
            subject: 'Recibimos tu mensaje - Praxia Labs',
            html: `
        <h2>Hola ${data.nombre},</h2>
        <p>Gracias por contactarnos. Nos pondremos en contacto pronto.</p>
        <p><strong>Proyecto:</strong> ${data.proyecto}</p>
        <hr />
        <p style="color: #888; font-size: 12px;">Praxia Labs © 2026</p>
      `,
        });

        if (clientEmailError) {
            console.error('Error enviando email al cliente:', clientEmailError);
            return NextResponse.json(
                { success: false, message: `Error de Resend: ${clientEmailError.message}` },
                { status: 500 }
            );
        }

        // Email a ti
        const { error: notifEmailError } = await resend.emails.send({
            from: 'Praxia Labs <noreply@praxialabs.com>',
            to: 'jmaria.romero@praxialabs.com',
            subject: `Nuevo contacto: ${data.nombre}`,
            html: `
        <h3>Nuevo contacto</h3>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Empresa:</strong> ${data.empresa || 'N/A'}</p>
        <p><strong>Proyecto:</strong> ${data.proyecto}</p>
        <h4>Mensaje:</h4>
        <p>${data.mensaje.replace(/\n/g, '<br>')}</p>
      `,
        });

        if (notifEmailError) {
            console.error('Error enviando notificación interna:', notifEmailError);
            // El email al cliente ya se envió, así que no devolvemos error al usuario
        }

        return NextResponse.json(
            { success: true, message: 'Mensaje enviado' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.issues[0]?.message || 'Validación fallida' },
                { status: 400 }
            );
        }

        console.error('Email error:', error);
        return NextResponse.json(
            { success: false, message: 'Error al enviar. Intenta de nuevo.' },
            { status: 500 }
        );
    }
}
