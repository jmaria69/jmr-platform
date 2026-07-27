import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';


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

        // Conectar con el CRM del admin: cada formulario entra como lead en el
        // pipeline (o suma una interacción si el contacto ya existía). Si el CRM
        // falla, el formulario sigue funcionando: nunca perdemos el mensaje.
        try {
            const summary = `Formulario web (${data.proyecto}): ${data.mensaje.slice(0, 300)}`;
            const existing = await prisma.crmContact.findFirst({ where: { email: data.email } });
            if (existing) {
                await prisma.interaction.create({
                    data: { contactId: existing.id, type: 'email', summary },
                });
                await prisma.crmContact.update({
                    where: { id: existing.id },
                    data: {
                        lastContact: new Date(),
                        tags: existing.tags.includes(data.proyecto) ? existing.tags : [...existing.tags, data.proyecto],
                    },
                });
            } else {
                await prisma.crmContact.create({
                    data: {
                        id: `c-${Date.now()}`,
                        name: data.nombre,
                        email: data.email,
                        company: data.empresa || null,
                        source: 'web',
                        stage: 'lead',
                        value: 0,
                        notes: '',
                        tags: [data.proyecto],
                        lastContact: new Date(),
                        interactions: { create: { type: 'email', summary } },
                    },
                });
            }
        } catch (crmErr) {
            console.error('CRM sync error (contacto guardado igualmente):', crmErr);
        }

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