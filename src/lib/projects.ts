import { Project } from "@/types";

export const projects: Project[] = [
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
    videoUrl: "/videos/admin-app.mp4",
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
    tech: ["React 18", "TypeScript", "Vite", "Python", "FastAPI", "Docker", "Redis", "PostgreSQL", "WebSocket", "Chart.js", "Nginx", "Claude API"],
    status: "production",
    category: "web",
    url: "https://core-ops-eight.vercel.app/",
    videoUrl: "/videos/core-ops.mp4",
    image: "/projects/crm-it.svg",
    color: "#06b6d4",
    metrics: { users: 85, revenue: 1800, rating: 4.6 },
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
    metrics: { users: 210, rating: 4.6 },
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
    metrics: { users: 340, rating: 4.7 },
  },
  {
    id: "cf-jaramal",
    name: "Club Fútbol Rivas 2016 B",
    description: "App de gestión para el equipo Rivas 2016 B: convocatorias, alineaciones, estadísticas de jugadores y comunicados internos.",
    longDescription:
      "Aplicación de gestión interna para el Club de Fútbol Rivas 2016 (categoría B). Permite al cuerpo técnico convocar jugadores con confirmación de asistencia, generar alineaciones, registrar resultados y estadísticas individuales (goles, asistencias, minutos). Los socios gestionan el pago de cuotas y reciben comunicados. Panel de administración para la directiva del club.",
    tech: ["HTML5", "CSS3", "JavaScript", "Claude AI"],
    status: "production",
    category: "web",
    image: "/projects/cf-jaramal.svg",
    color: "#ef4444",
    metrics: { users: 40, rating: 4.8 },
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
    metrics: { users: 200, rating: 4.9 },
  },
  {
    id: "vozflow",
    name: "VozFlow Ultra Pro",
    description: "Motor de voz avanzado: transcripción en tiempo real, síntesis natural y comandos por voz con modelos de IA de última generación.",
    longDescription:
      "Aplicación de escritorio multiplataforma (Windows, macOS) para reconocimiento y síntesis de voz de alta precisión. Transcripción en tiempo real con puntuación automática, síntesis de voz con clonación de timbre, comandos de automatización activados por voz y exportación a múltiples formatos. Construida sobre modelos Whisper y ElevenLabs con interfaz nativa.",
    tech: ["Python", "Whisper AI", "ElevenLabs", "PyQt6", "FFmpeg", "PyInstaller"],
    status: "production",
    category: "desktop",
    image: "/projects/vozflow.svg",
    color: "#8b5cf6",
    metrics: { users: 90, rating: 4.5 },
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
    metrics: { users: 180, rating: 4.9 },
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
    id: "olga-ai",
    name: "OLGA.ai",
    description: "Sistema multi-agente de operaciones: logística, Google Workspace, podcasts y automatización total vía Telegram.",
    longDescription:
      "OLGA (Operative Logistics & General Assistant) es un sistema multi-agente dockerizado que actúa como controlador maestro de operaciones. Integra una red de agentes especializados — Cleo (email y LinkedIn), Miguel (auditorías virales de marketing) y Valentina (estética y contenido) — con un motor de podcasts basado en Remotion, sincronización de inventario Amazon/GSheet, automatización completa de Google Workspace y un bot de Telegram como interfaz conversacional. Panel en tiempo real con monitorización de contenedores Docker, métricas de tokens y escudo de seguridad activo.",
    tech: ["Python", "FastAPI", "Docker Compose", "Remotion", "FFmpeg", "Telegram Bot API", "Google Workspace APIs", "Ollama", "LangChain", "PostgreSQL", "Serveo"],
    status: "production",
    category: "ai",
    url: "https://bb820fb83bca4b94-188-26-209-26.serveousercontent.com/dashboard/landing.html",
    videoUrl: "/videos/olga-ai.mp4",
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
