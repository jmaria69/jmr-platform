import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "admin-app",
    name: "AdminApp",
    description: "Panel de administración inteligente con agentes IA para gestión empresarial.",
    longDescription:
      "Plataforma completa de administración empresarial potenciada por agentes de inteligencia artificial. Incluye gestión de tareas, automatización de procesos, generación de informes y análisis predictivo. Construida con Next.js y Python para máximo rendimiento.",
    tech: ["Next.js", "Python", "AI Agents", "PostgreSQL"],
    status: "production",
    category: "web",
    image: "/projects/admin-app.svg",
    color: "#6366f1",
    metrics: { users: 150, revenue: 2400, rating: 4.8 },
  },
  {
    id: "crm-it",
    name: "CRM IT",
    description: "CRM especializado en empresas tecnológicas con pipeline visual y automatización.",
    longDescription:
      "Sistema CRM diseñado específicamente para empresas de tecnología. Pipeline visual tipo Kanban, automatización de seguimiento, integración con email y calendario, métricas de conversión en tiempo real y reportes personalizados.",
    tech: ["React", "Vite", "TypeScript", "Node.js"],
    status: "production",
    category: "web",
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
    description: "Suite de automatización para Google Workspace con dashboard y bots.",
    longDescription:
      "Suite completa de herramientas de automatización para Google Workspace. Incluye dashboard de productividad, bots de Slack/Discord, automatización de emails, gestión documental inteligente y métricas de equipo en tiempo real.",
    tech: ["Python", "Google APIs", "Docker", "Redis"],
    status: "production",
    category: "automation",
    image: "/projects/gws.svg",
    color: "#8b5cf6",
    metrics: { users: 95, revenue: 3200, rating: 4.7 },
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return projects.filter((p) => p.category === category);
}
