import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "admin-app",
    name: "AdminApp Maestro",
    description: "Panel de administración inteligente con agentes IA VERA y QUENTIN para gestoras de comunidades.",
    longDescription:
      "Plataforma de property management potenciada por agentes IA. VERA Copilot gestiona finanzas, auditorías y morosidad sin intervención humana. QUENTIN Predict anticipa averías en ascensores e infraestructura. Control de accesos NFC/QR y módulo financiero con informes PDF automáticos. Construida con Next.js y Python.",
    tech: ["Next.js", "Python", "AI Agents", "PostgreSQL", "NFC/QR"],
    status: "production",
    category: "web",
    url: "https://adminapp-maestro.vercel.app/presentation",
    image: "/projects/admin-app.svg",
    color: "#6366f1",
    metrics: { users: 150, revenue: 2400, rating: 4.8 },
  },
  {
    id: "crm-it",
    name: "Core OPS",
    description: "Centro de mando enterprise para equipos IT: red, ERP, operaciones y marketing en un único panel.",
    longDescription:
      "Plataforma IT enterprise que unifica monitorización de red, ERP integrado (RRHH, inventario, compras), gestión de campañas de marketing y operaciones en tiempo real. Incluye AutoPilot tour, telemetría Docker, detección de amenazas activa y agente VERA para análisis conversacional. Demo en modo AutoPilot disponible.",
    tech: ["React", "Vite", "Python", "Docker", "Redis"],
    status: "production",
    category: "web",
    url: "https://core-ops-eight.vercel.app/",
    image: "/projects/crm-it.svg",
    color: "#06b6d4",
    metrics: { users: 85, revenue: 1800, rating: 4.6 },
  },
  {
    id: "landing-inmobiliaria",
    name: "Portal Inmobiliario",
    description: "Landing page premium para el sector inmobiliario con búsqueda avanzada.",
    longDescription:
      "Portal inmobiliario con diseño premium, búsqueda avanzada de propiedades con filtros geográficos, galería de imágenes interactiva, calculadora de hipotecas y sistema de contacto directo con agentes.",
    tech: ["HTML5", "CSS3", "JavaScript", "Maps API"],
    status: "production",
    category: "web",
    image: "/projects/inmobiliaria.svg",
    color: "#10b981",
    metrics: { users: 320, revenue: 950, rating: 4.5 },
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
    metrics: { users: 45, rating: 4.3 },
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
    metrics: { users: 200, revenue: 600, rating: 4.4 },
  },
  {
    id: "gws",
    name: "GWS Suite",
    description: "Suite de productividad con Cleo IA, creación de podcasts, sync de inventario y automatización Google Workspace.",
    longDescription:
      "Plataforma todo-en-uno construida sobre Google Workspace. Integra a Cleo, la asistente IA con red de agentes especializados; un módulo de creación y publicación de podcasts; sincronización de inventario en tiempo real; y automatización completa de correo, Drive, Calendar y Sheets. Un único dashboard para gestionar toda la operativa de negocio.",
    tech: ["Python", "Google APIs", "AI Agents", "Docker", "Redis"],
    status: "production",
    category: "automation",
    url: "https://4894de1777b20897-188-26-209-26.serveousercontent.com/dashboard/",
    image: "/projects/gws.svg",
    color: "#8b5cf6",
    metrics: { users: 95, revenue: 3200, rating: 4.7 },
  },
  {
    id: "olga-ai",
    name: "Olga.ai",
    description: "Agente IA de logística operativa: rutas, stock, proveedores y cadena de suministro en tiempo real.",
    longDescription:
      "Olga es un agente de inteligencia artificial especializado en Operative Logistics. Optimiza rutas de distribución, gestiona niveles de stock con alertas predictivas, coordina proveedores y genera informes de cadena de suministro automáticamente. Diseñada para operar sin intervención humana en ciclos operativos completos.",
    tech: ["Python", "FastAPI", "AI Agents", "PostgreSQL", "Redis"],
    status: "production",
    category: "ai",
    image: "/projects/gws.svg",
    color: "#f97316",
    metrics: { users: 40, revenue: 1600, rating: 4.6 },
  },
  {
    id: "asistente-general",
    name: "Asistente General",
    description: "Copiloto conversacional IA para gestión de tareas, agenda, comunicaciones y flujos de trabajo.",
    longDescription:
      "Asistente de propósito general basado en agentes IA que actúa como copiloto personal y empresarial. Gestiona agenda, prioriza tareas, redacta y responde comunicaciones, automatiza flujos de aprobación y mantiene el contexto entre sesiones. Integrable con Google Workspace, Slack y sistemas propios mediante API.",
    tech: ["Python", "LLM", "AI Agents", "Google APIs", "FastAPI"],
    status: "production",
    category: "ai",
    image: "/projects/admin-app.svg",
    color: "#10b981",
    metrics: { users: 60, revenue: 1200, rating: 4.5 },
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return projects.filter((p) => p.category === category);
}
