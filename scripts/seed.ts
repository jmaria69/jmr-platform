/**
 * Database seed script
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Creates the initial admin user and seeds projects + CRM data.
 * Requires DATABASE_URL in .env.local or environment.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import {
  adminUsers,
  projects,
  crmContacts,
  interactions,
} from "../src/lib/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL is not set. Add it to .env.local");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("🌱 Seeding database...\n");

  // ─── Admin user ───
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jmrplatform.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await hash(adminPassword, 12);

  await db
    .insert(adminUsers)
    .values({
      email: adminEmail,
      name: "JMR Admin",
      passwordHash,
      role: "admin",
    })
    .onConflictDoNothing();

  console.log(`✅ Admin user: ${adminEmail}`);

  // ─── Projects ───
  const projectData = [
    {
      id: "admin-app",
      name: "AdminApp",
      description:
        "Panel administrativo completo con dashboard, CRM y analytics.",
      longDescription:
        "Sistema de administración empresarial con monitorización en tiempo real, gestión de contactos CRM con pipeline Kanban, y analytics avanzados para toma de decisiones.",
      tech: ["Next.js", "TypeScript", "Tailwind", "Recharts", "Drizzle"],
      status: "production" as const,
      category: "web" as const,
      url: "https://admin.jmrplatform.com",
      image: "/projects/admin-app.png",
      color: "#6366f1",
      metricsUsers: 1200,
      metricsRevenue: 3500,
      metricsRating: 4.8,
    },
    {
      id: "crm-it",
      name: "CRM IT",
      description: "CRM especializado para empresas tecnológicas con pipeline visual.",
      longDescription:
        "Sistema CRM diseñado para equipos de ventas en el sector tecnológico. Incluye pipeline Kanban, seguimiento de interacciones, y reportes de rendimiento.",
      tech: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
      status: "production" as const,
      category: "web" as const,
      url: "https://crm.jmrplatform.com",
      image: "/projects/crm-it.png",
      color: "#06b6d4",
      metricsUsers: 850,
      metricsRevenue: 2800,
      metricsRating: 4.6,
    },
    {
      id: "landing-inmobiliaria",
      name: "Portal Inmobiliario",
      description: "Landing page premium para agencia inmobiliaria con catálogo interactivo.",
      longDescription:
        "Portal web inmobiliario con búsqueda avanzada, tours virtuales 360°, calculadora de hipotecas y sistema de citas integrado.",
      tech: ["Next.js", "Three.js", "Mapbox", "Stripe", "Sanity"],
      status: "production" as const,
      category: "web" as const,
      url: "https://inmobiliaria.jmrplatform.com",
      image: "/projects/inmobiliaria.png",
      color: "#10b981",
      metricsUsers: 3200,
      metricsRevenue: 5200,
      metricsRating: 4.9,
    },
    {
      id: "app-voz",
      name: "AppVoz",
      description: "Aplicación de asistente de voz con IA para automatización de tareas.",
      longDescription:
        "Asistente de voz inteligente que utiliza modelos de lenguaje para automatizar tareas diarias, gestión de agenda y control de dispositivos IoT.",
      tech: ["Python", "FastAPI", "Whisper", "GPT-4", "React Native"],
      status: "beta" as const,
      category: "ai" as const,
      image: "/projects/app-voz.png",
      color: "#f59e0b",
      metricsUsers: 450,
      metricsRating: 4.3,
    },
    {
      id: "mejores-productos",
      name: "MejoresProductos",
      description:
        "Comparador de productos con scraping inteligente y rankings automatizados.",
      longDescription:
        "Plataforma de comparación de productos con web scraping en tiempo real, rankings basados en reseñas, alertas de precio y afiliación automatizada.",
      tech: ["Next.js", "Puppeteer", "MongoDB", "Redis", "AWS Lambda"],
      status: "production" as const,
      category: "web" as const,
      url: "https://mejoresproductos.jmrplatform.com",
      image: "/projects/mejores-productos.png",
      color: "#ef4444",
      metricsUsers: 15000,
      metricsRevenue: 8500,
      metricsRating: 4.7,
    },
    {
      id: "gws-suite",
      name: "GWS Suite",
      description: "Suite de herramientas de productividad empresarial todo en uno.",
      longDescription:
        "Suite integrada de productividad que incluye gestión de proyectos, comunicación de equipo, almacenamiento de archivos y herramientas de colaboración en tiempo real.",
      tech: ["Electron", "React", "SQLite", "WebRTC", "Socket.io"],
      status: "development" as const,
      category: "desktop" as const,
      image: "/projects/gws-suite.png",
      color: "#8b5cf6",
      metricsUsers: 200,
      metricsRating: 4.1,
    },
  ];

  for (const p of projectData) {
    await db.insert(projects).values(p).onConflictDoNothing();
  }
  console.log(`✅ ${projectData.length} projects seeded`);

  // ─── CRM contacts ───
  const contactData = [
    {
      id: "c-1",
      name: "María García",
      email: "maria@techcorp.es",
      phone: "+34 612 345 678",
      company: "TechCorp",
      source: "web" as const,
      stage: "proposal" as const,
      value: 15000,
      notes: "Interesada en AdminApp para su equipo de 50 personas.",
      tags: ["enterprise", "high-value", "AdminApp"],
      lastContact: new Date("2025-01-10"),
    },
    {
      id: "c-2",
      name: "Carlos López",
      email: "carlos@innovatech.com",
      company: "InnovaTech",
      source: "referral" as const,
      stage: "qualified" as const,
      value: 8000,
      notes: "Referido por María García. Necesita CRM personalizado.",
      tags: ["referral", "CRM"],
      lastContact: new Date("2025-01-08"),
    },
    {
      id: "c-3",
      name: "Ana Martínez",
      email: "ana@startuplab.io",
      company: "StartupLab",
      source: "social" as const,
      stage: "lead" as const,
      value: 3000,
      notes: "Contacto vía LinkedIn. Interesada en landing page.",
      tags: ["startup", "landing"],
      lastContact: new Date("2025-01-12"),
    },
    {
      id: "c-4",
      name: "Pedro Sánchez",
      email: "pedro@bigretail.es",
      company: "BigRetail",
      source: "campaign" as const,
      stage: "negotiation" as const,
      value: 25000,
      notes: "Campaña de email marketing. Suite completa para retail.",
      tags: ["enterprise", "high-value", "suite"],
      lastContact: new Date("2025-01-11"),
    },
    {
      id: "c-5",
      name: "Laura Fernández",
      email: "laura@designstudio.com",
      company: "Design Studio",
      source: "web" as const,
      stage: "closed-won" as const,
      value: 12000,
      notes: "Proyecto completado. Portal inmobiliario personalizado.",
      tags: ["design", "completed"],
      lastContact: new Date("2024-12-20"),
    },
    {
      id: "c-6",
      name: "Roberto Díaz",
      email: "roberto@consultoria.es",
      company: "Consultoría Díaz",
      source: "direct" as const,
      stage: "closed-lost" as const,
      value: 5000,
      notes: "No avanzó por presupuesto limitado.",
      tags: ["lost", "budget"],
      lastContact: new Date("2024-12-15"),
    },
  ];

  for (const c of contactData) {
    await db.insert(crmContacts).values(c).onConflictDoNothing();
  }
  console.log(`✅ ${contactData.length} CRM contacts seeded`);

  // ─── Interactions ───
  const interactionData = [
    { id: "i-1", contactId: "c-1", type: "email" as const, date: new Date("2025-01-05"), summary: "Primer contacto vía formulario web." },
    { id: "i-2", contactId: "c-1", type: "call" as const, date: new Date("2025-01-07"), summary: "Llamada de cualificación de 30 min." },
    { id: "i-3", contactId: "c-1", type: "demo" as const, date: new Date("2025-01-10"), summary: "Demo de AdminApp — muy interesada." },
    { id: "i-4", contactId: "c-2", type: "meeting" as const, date: new Date("2025-01-08"), summary: "Reunión presencial en Madrid." },
    { id: "i-5", contactId: "c-4", type: "email" as const, date: new Date("2025-01-09"), summary: "Envío de propuesta comercial." },
    { id: "i-6", contactId: "c-4", type: "call" as const, date: new Date("2025-01-11"), summary: "Negociación de condiciones." },
    { id: "i-7", contactId: "c-5", type: "meeting" as const, date: new Date("2024-12-15"), summary: "Kickoff del proyecto." },
    { id: "i-8", contactId: "c-5", type: "note" as const, date: new Date("2024-12-20"), summary: "Proyecto entregado con éxito." },
  ];

  for (const i of interactionData) {
    await db.insert(interactions).values(i).onConflictDoNothing();
  }
  console.log(`✅ ${interactionData.length} interactions seeded`);

  console.log("\n🎉 Seed complete!");
  console.log(`\n📧 Login: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
