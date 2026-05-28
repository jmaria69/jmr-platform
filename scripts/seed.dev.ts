import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        throw new Error("ADMIN_PASSWORD no definida en .env.local");
    }

    const hashedPassword = await hash(adminPassword, 12);

    // ─── Admins ───
    await prisma.adminUser.upsert({
        where: { email: "admin@test.com" },
        update: { passwordHash: hashedPassword },
        create: {
            email: "admin@test.com",
            passwordHash: hashedPassword,
            name: "Admin Test",
            role: "admin",
        },
    });

    await prisma.adminUser.upsert({
        where: { email: "jmaria.romero@praxialabs.com" },
        update: { passwordHash: hashedPassword },
        create: {
            email: "jmaria.romero@praxialabs.com",
            passwordHash: hashedPassword,
            name: "Jose Maria",
            role: "admin",
        },
    });

    console.log("✅ Admins sincronizados");

    // ─── Proyectos ───
    const projects = [
        {
            id: "adminapp",
            name: "AdminApp",
            description: "Panel administrativo completo con dashboard, CRM y analytics.",
            longDescription: "Panel administrativo completo con dashboard, CRM y analytics.",
            tech: ["Next.js", "TypeScript", "Tailwind"],
            status: "production",
            category: "web",
            url: "https://adminapp.com",
            github: "https://github.com/example/adminapp",
            image: "/projects/adminapp.jpg",
            color: "#3B82F6",
            metricsUsers: 1200,
            metricsRevenue: 3500,
            metricsRating: 4.8,
        },
        {
            id: "crm-it",
            name: "CRM IT",
            description: "CRM especializado para empresas tecnológicas con pipeline visual.",
            longDescription: "CRM especializado para empresas tecnológicas con pipeline visual.",
            tech: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
            status: "production",
            category: "web",
            url: "https://crm-it.com",
            github: "https://github.com/example/crm-it",
            image: "/projects/crm-it.jpg",
            color: "#10B981",
            metricsUsers: 850,
            metricsRevenue: 2800,
            metricsRating: 4.6,
        },
        {
            id: "portal-inmobiliario",
            name: "Portal Inmobiliario",
            description: "Landing page premium para agencia inmobiliaria con catálogo interactivo.",
            longDescription: "Landing page premium para agencia inmobiliaria con catálogo interactivo.",
            tech: ["Next.js", "Three.js", "Mapbox", "Stripe", "Sanity"],
            status: "production",
            category: "web",
            url: "https://portal-inmobiliario.com",
            github: "https://github.com/example/portal-inmobiliario",
            image: "/projects/portal-inmobiliario.jpg",
            color: "#F59E0B",
            metricsUsers: 3300,
            metricsRevenue: 5200,
            metricsRating: 4.9,
        },
        {
            id: "appvoz",
            name: "AppVoz",
            description: "Aplicación de asistente de voz con IA para automatización de tareas.",
            longDescription: "Aplicación de asistente de voz con IA para automatización de tareas.",
            tech: ["Python", "FastAPI", "Whisper", "GPT-4", "React Native"],
            status: "beta",
            category: "app",
            url: "https://appvoz.com",
            github: "https://github.com/example/appvoz",
            image: "/projects/appvoz.jpg",
            color: "#8B5CF6",
            metricsUsers: 450,
            metricsRevenue: 1200,
            metricsRating: 4.3,
        },
        {
            id: "mejoresproductos",
            name: "MejoresProductos",
            description: "Comparador de productos con scraping inteligente y rankings automatizados.",
            longDescription: "Comparador de productos con scraping inteligente y rankings automatizados.",
            tech: ["Next.js", "Puppeteer", "MongoDB", "Redis", "AWS Lambda"],
            status: "production",
            category: "web",
            url: "https://mejoresproductos.com",
            github: "https://github.com/example/mejoresproductos",
            image: "/projects/mejoresproductos.jpg",
            color: "#EF4444",
            metricsUsers: 15000,
            metricsRevenue: 8500,
            metricsRating: 4.7,
        },
        {
            id: "gws-suite",
            name: "GWS Suite",
            description: "Suite de herramientas de productividad empresarial todo en uno.",
            longDescription: "Suite de herramientas de productividad empresarial todo en uno.",
            tech: ["Electron", "React", "SQLite", "WebRTC", "Socket.io"],
            status: "development",
            category: "desktop",
            url: "https://gws-suite.com",
            github: "https://github.com/example/gws-suite",
            image: "/projects/gws-suite.jpg",
            color: "#06B6D4",
            metricsUsers: 200,
            metricsRevenue: 800,
            metricsRating: 4.1,
        },
    ];

    for (const project of projects) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: project,
            create: project,
        });
    }

    console.log("✅ Proyectos sincronizados");

    // ─── CRM Contacts ───
    const crmContacts = [
        {
            id: "contact-1",
            name: "Ana Martínez",
            email: "ana@startupslab.com",
            phone: "+34 666 123 456",
            company: "StartupLab",
            source: "linkedin",
            stage: "lead",
            value: 3000,
            notes: "Interesada en soluciones CRM",
            tags: ["startup", "tech"],
            lastContact: new Date("2025-12-01"),
        },
        {
            id: "contact-2",
            name: "Carlos López",
            email: "carlos@innovatech.com",
            phone: "+34 666 234 567",
            company: "InnovaTech",
            source: "referral",
            stage: "contacted",
            value: 8000,
            notes: "Proyecto de integración",
            tags: ["referral", "crm"],
            lastContact: new Date("2025-08-15"),
        },
        {
            id: "contact-3",
            name: "María García",
            email: "maria@bigexample.com",
            phone: "+34 666 345 678",
            company: "BigExample",
            source: "website",
            stage: "qualified",
            value: 15000,
            notes: "Enterprise solution",
            tags: ["enterprise", "high-value"],
            lastContact: new Date("2025-10-10"),
        },
        {
            id: "contact-4",
            name: "Pedro Sánchez",
            email: "pedro@mediumbiz.com",
            phone: "+34 666 456 789",
            company: "MediumBiz",
            source: "contact_form",
            stage: "negotiation",
            value: 25000,
            notes: "Negociando términos",
            tags: ["enterprise", "high-value"],
            lastContact: new Date("2025-11-20"),
        },
        {
            id: "contact-5",
            name: "Laura Fernández",
            email: "laura@designstudio.com",
            phone: "+34 666 567 890",
            company: "Design Studio",
            source: "event",
            stage: "closed-won",
            value: 12000,
            notes: "Contrato firmado",
            tags: ["design", "completed"],
            lastContact: new Date("2025-12-15"),
        },
        {
            id: "contact-6",
            name: "Roberto Díaz",
            email: "roberto@oldcorp.com",
            phone: "+34 666 678 901",
            company: "OldCorp",
            source: "cold_call",
            stage: "closed-lost",
            value: 5000,
            notes: "No interesado",
            tags: ["lost", "budget"],
            lastContact: new Date("2025-11-05"),
        },
    ];

    for (const contact of crmContacts) {
        await prisma.crmContact.upsert({
            where: { id: contact.id },
            update: contact,
            create: contact,
        });
    }

    console.log("✅ CRM Contacts sincronizados");

    // ─── Interactions ───
    const interactions = [
        {
            id: "int-1",
            contactId: "contact-1",
            type: "email",
            date: new Date("2025-11-28"),
            summary: "Email de presentación enviado",
        },
        {
            id: "int-2",
            contactId: "contact-1",
            type: "call",
            date: new Date("2025-12-01"),
            summary: "Llamada inicial - muy interesada",
        },
        {
            id: "int-3",
            contactId: "contact-2",
            type: "meeting",
            date: new Date("2025-08-10"),
            summary: "Reunión de descubrimiento",
        },
        {
            id: "int-4",
            contactId: "contact-2",
            type: "demo",
            date: new Date("2025-08-15"),
            summary: "Demo del producto",
        },
        {
            id: "int-5",
            contactId: "contact-3",
            type: "email",
            date: new Date("2025-09-20"),
            summary: "Propuesta comercial enviada",
        },
        {
            id: "int-6",
            contactId: "contact-3",
            type: "meeting",
            date: new Date("2025-10-10"),
            summary: "Reunión con stakeholders",
        },
        {
            id: "int-7",
            contactId: "contact-4",
            type: "call",
            date: new Date("2025-11-15"),
            summary: "Negociación de precios",
        },
        {
            id: "int-8",
            contactId: "contact-4",
            type: "note",
            date: new Date("2025-11-20"),
            summary: "Acuerdo cercano - próxima reunión en 1 semana",
        },
        {
            id: "int-9",
            contactId: "contact-5",
            type: "meeting",
            date: new Date("2025-12-10"),
            summary: "Firma del contrato",
        },
        {
            id: "int-10",
            contactId: "contact-5",
            type: "email",
            date: new Date("2025-12-15"),
            summary: "Confirmación de implementación",
        },
        {
            id: "int-11",
            contactId: "contact-6",
            type: "call",
            date: new Date("2025-11-05"),
            summary: "Cliente no tiene presupuesto este año",
        },
    ];

    for (const interaction of interactions) {
        await prisma.interaction.upsert({
            where: { id: interaction.id },
            update: interaction,
            create: interaction,
        });
    }

    console.log("✅ Interactions sincronizadas");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });