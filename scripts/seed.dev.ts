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

    // Admins
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

    // Proyectos
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

    console.log("✅ Admins y proyectos sincronizados");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });