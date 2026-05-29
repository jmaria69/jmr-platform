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
    const seedProjects = [
        {
            id: "olga-ai",
            name: "OLGA.ai",
            description: "Sistema multi-agente de operaciones: logística, Google Workspace, podcasts y automatización total vía Telegram.",
            longDescription:
                "OLGA (Operative Logistics & General Assistant) es un sistema multi-agente dockerizado que actúa como controlador maestro de operaciones. Integra una red de agentes especializados — Cleo (email y LinkedIn), Miguel (auditorías virales de marketing) y Valentina (estética y contenido) — con un motor de podcasts basado en Remotion, sincronización de inventario Amazon/GSheet, automatización completa de Google Workspace y un bot de Telegram como interfaz conversacional. Panel en tiempo real con monitorización de contenedores Docker, métricas de tokens y escudo de seguridad activo.",
            tech: ["Python", "FastAPI", "Docker Compose", "Remotion", "FFmpeg", "Telegram Bot API", "Google Workspace APIs", "Ollama", "LangChain", "PostgreSQL", "Serveo"],
            status: "production",
            category: "ai",
            url: "https://694de94d9c69f2c5-188-26-209-26.serveousercontent.com/dashboard",
            image: "/projects/gws.svg",
            color: "#8b5cf6",
            metricsUsers: 95,
            metricsRevenue: 3200,
            metricsRating: 4.7,
        },
        {
            id: "admin-app",
            name: "AdminApp Maestro",
            description: "Panel de administración inteligente con agentes IA VERA y QUENTIN para gestoras de comunidades.",
            longDescription:
                "Plataforma de property management potenciada por agentes IA. VERA Copilot gestiona finanzas, auditorías y morosidad sin intervención humana. QUENTIN Predict anticipa averías en ascensores e infraestructura. Control de accesos NFC/QR y módulo financiero con informes PDF automáticos. Construida con Next.js y Python.",
            tech: ["Next.js 15", "TypeScript", "Python", "FastAPI", "Claude API", "PostgreSQL", "Tailwind CSS", "NextAuth.js", "NFC/QR", "Vercel"],
            status: "production",
            category: "web",
            url: "https://adminapp-maestro.vercel.app/presentation",
            image: "/projects/admin-app.svg",
            color: "#6366f1",
            metricsUsers: 150,
            metricsRevenue: 2400,
            metricsRating: 4.8,
        },
        {
            id: "crm-it",
            name: "Core OPS",
            description: "Centro de mando enterprise para equipos IT: red, ERP, operaciones y marketing en un único panel.",
            longDescription:
                "Plataforma IT enterprise que unifica monitorización de red, ERP integrado (RRHH, inventario, compras), gestión de campañas de marketing y operaciones en tiempo real. Incluye AutoPilot tour, telemetría Docker, detección de amenazas activa y agente VERA para análisis conversacional. Demo en modo AutoPilot disponible.",
            tech: ["React 18", "TypeScript", "Vite", "Python", "FastAPI", "Docker", "Redis", "PostgreSQL", "WebSocket", "Chart.js", "Nginx", "Claude API"],
            status: "production",
            category: "web",
            url: "https://core-ops-eight.vercel.app/",
            image: "/projects/crm-it.svg",
            color: "#06b6d4",
            metricsUsers: 85,
            metricsRevenue: 1800,
            metricsRating: 4.6,
        },
        {
            id: "generador-ideas",
            name: "Agente Emprendedor IA",
            description: "Evalúa ideas de negocio con IA: análisis DAFO, viabilidad, plan semanal de acción y chat con tu mentor emprendedor personal.",
            longDescription:
                "Herramienta SPA para emprendedores impulsada por Claude AI. El usuario registra sus ideas, las evalúa con análisis DAFO completo (fortalezas, debilidades, oportunidades, amenazas), obtiene información sobre mercado objetivo, modelo de negocio, inversión estimada y tiempo al mercado. Genera planes semanales con tareas diarias concretas y permite chatear con un mentor IA sobre cualquier aspecto de su idea. Las ideas se guardan en localStorage para acceso persistente.",
            tech: ["HTML5", "Vanilla JS", "Claude API", "Vercel Edge Functions", "LocalStorage"],
            status: "production",
            category: "ai",
            url: "https://generador-ideas.vercel.app",
            image: "/projects/generador-ideas.svg",
            color: "#f59e0b",
            metricsUsers: 340,
            metricsRating: 4.7,
        },
        {
            id: "campo-abierto",
            name: "Campo Abierto",
            description: "PWA para comunidades rurales: encuentra ayudas PAC, subvenciones y recursos públicos según tu explotación agraria o ganadera.",
            longDescription:
                "Aplicación web progresiva (PWA) pensada para agricultores y ganaderos de España. El usuario describe su explotación y el sistema cruza los datos con una base de ayudas actualizada para mostrar exactamente qué subvenciones PAC, ayudas autonómicas y recursos públicos le corresponden, con los pasos para solicitarlas. Funciona offline gracias al service worker. Backend en Python/FastAPI, frontend PWA instalable en móvil.",
            tech: ["Python", "FastAPI", "PWA", "Service Worker", "HTML5", "CSS3", "JavaScript", "Pydantic"],
            status: "production",
            category: "web",
            image: "/projects/campo-abierto.svg",
            color: "#10b981",
            metricsUsers: 210,
            metricsRating: 4.6,
        },
        {
            id: "cf-jaramal",
            name: "Club Fútbol Rivas 2016 B",
            description: "App de gestión para el equipo Rivas 2016 B: convocatorias, alineaciones, estadísticas de jugadores y comunicados internos.",
            longDescription:
                "Aplicación de gestión interna para el Club de Fútbol Rivas 2016 (categoría B). Permite al cuerpo técnico convocar jugadores con confirmación de asistencia, generar alineaciones con visualización en campo, registrar resultados y estadísticas individuales (goles, asistencias, minutos, tarjetas). Panel de comunicados internos para la plantilla y directiva. Datos persistentes en localStorage.",
            tech: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "CSS Grid", "CSS Animations"],
            status: "production",
            category: "web",
            url: "https://cf-rivas-2016b.vercel.app",
            image: "/projects/cf-jaramal.svg",
            color: "#ef4444",
            metricsUsers: 40,
            metricsRating: 4.8,
        },
        {
            id: "cd-rivas-jarama",
            name: "CD Rivas Jarama",
            description: "Web oficial del Club Deportivo Rivas Jarama: equipos, partidos, noticias, instalaciones e inscripciones. 200+ jugadores, 12 equipos.",
            longDescription:
                "Sitio web oficial del Club Deportivo Rivas Jarama, fundado en 2019 en Rivas-Vaciamadrid. Más de 200 jugadores repartidos en 12 equipos en la temporada 2025/2026. La web incluye sección de equipos con plantillas, calendario de próximos partidos, noticias del club, galería de instalaciones deportivas y formulario de inscripción. Diseño con los colores reales del club (rosa y azul marino). Totalmente responsive y optimizada para móvil.",
            tech: ["HTML5", "CSS3", "JavaScript", "Google Fonts", "CSS Grid", "CSS Animations"],
            status: "production",
            category: "web",
            url: "https://cd-rivas-jarama.vercel.app",
            image: "/projects/cd-rivas-jarama.svg",
            color: "#1A3464",
            metricsUsers: 200,
            metricsRating: 4.9,
        },
        {
            id: "frajamo",
            name: "Frajamo Madrid",
            description: "Web premium para centro de adiestramiento canino profesional en Madrid. Javier Moreno — Instructor RSCE, Juez Internacional, +18 años de experiencia.",
            longDescription:
                "Sitio web premium para Frajamo Madrid, centro de adiestramiento canino profesional dirigido por Javier Moreno: Instructor Formador Superior RSCE, Juez Internacional de Trabajo y profesional acreditado por el Ministerio del Interior con más de 18 años de experiencia. La web incluye presentación de servicios (adiestramiento individual, cursos, formación a instructores), sección de precios detallada, perfil profesional y formulario de contacto. Diseño oscuro con degradados azul marino y detalles dorados, glassmorphism y tipografía premium (Playfair Display). Reconocido por la Comunidad de Madrid.",
            tech: ["HTML5", "CSS3", "JavaScript", "Google Fonts", "CSS Animations", "Glassmorphism"],
            status: "production",
            category: "web",
            url: "https://frajamo-madrid.vercel.app",
            image: "/projects/frajamo.svg",
            color: "#c9a84c",
            metricsUsers: 180,
            metricsRating: 4.9,
        },
        {
            id: "landing-inmobiliaria",
            name: "InmoTech",
            description: "Plataforma inmobiliaria con IA: cualifica leads automáticamente, genera tours inmersivos y elimina el papeleo de tu agencia.",
            longDescription:
                "InmoTech es la plataforma todo-en-uno para agencias inmobiliarias potenciada por IA. Cualifica leads automáticamente, genera tours inmersivos de propiedades, gestiona el catálogo con dashboard en tiempo real, calculadora de hipotecas integrada y contacto directo con agentes. Diseño premium con búsqueda avanzada y filtros geográficos.",
            tech: ["Vite", "JavaScript", "CSS3", "HTML5"],
            status: "production",
            category: "web",
            url: "https://landing-inmobiliaria-tau.vercel.app/",
            image: "/projects/inmobiliaria.svg",
            color: "#10b981",
            metricsUsers: 320,
            metricsRevenue: 950,
            metricsRating: 4.5,
        },
        {
            id: "app-voz",
            name: "AppVoz",
            description: "Aplicación multiplataforma de reconocimiento y síntesis de voz con IA.",
            longDescription:
                "App nativa para Android, macOS y Windows que permite reconocimiento de voz avanzado, transcripción en tiempo real, síntesis de voz natural y comandos por voz. Usa modelos de IA de última generación para máxima precisión.",
            tech: ["Python", "TensorFlow", "Android SDK", "Swift"],
            status: "beta",
            category: "mobile",
            image: "/projects/app-voz.svg",
            color: "#f59e0b",
            metricsUsers: 45,
            metricsRating: 4.3,
        },
        {
            id: "app-mejores-productos",
            name: "MejoresProductos",
            description: "Comparador inteligente de productos con scraping y análisis de precios.",
            longDescription:
                "Motor de comparación de productos que recopila datos de múltiples fuentes mediante web scraping inteligente, analiza tendencias de precios, genera alertas y recomendaciones personalizadas usando machine learning.",
            tech: ["Python", "Selenium", "ML", "FastAPI"],
            status: "beta",
            category: "ai",
            image: "/projects/mejores-productos.svg",
            color: "#ef4444",
            metricsUsers: 200,
            metricsRevenue: 600,
            metricsRating: 4.4,
        },
    ];

    for (const project of seedProjects) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: {
                name: project.name,
                description: project.description,
                longDescription: project.longDescription,
                tech: project.tech,
                status: project.status,
                category: project.category,
                url: project.url || null,
                image: project.image,
                color: project.color,
                metricsUsers: project.metricsUsers || null,
                metricsRevenue: project.metricsRevenue || null,
                metricsRating: project.metricsRating || null,
            },
            create: {
                id: project.id,
                name: project.name,
                description: project.description,
                longDescription: project.longDescription,
                tech: project.tech,
                status: project.status,
                category: project.category,
                url: project.url || null,
                image: project.image,
                color: project.color,
                metricsUsers: project.metricsUsers || null,
                metricsRevenue: project.metricsRevenue || null,
                metricsRating: project.metricsRating || null,
            },
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