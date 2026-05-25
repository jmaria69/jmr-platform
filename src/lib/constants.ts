/**
 * Application constants — single source of truth
 *
 * Never hardcode strings, numbers, or configuration
 * in components. Reference from here instead.
 */

export const APP_NAME = "PraxiaLab";
export const APP_DESCRIPTION =
  "Laboratorio de agentes IA: soluciones inteligentes para automatización, CRM y aplicaciones empresariales.";

// ─── Navigation ───

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/crm", label: "CRM", icon: "Users" },
  { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/admin/proyectos", label: "Proyectos", icon: "FolderKanban" },
  { href: "/admin/seguridad", label: "Seguridad", icon: "Shield" },
  { href: "/admin/credenciales", label: "Credenciales", icon: "KeyRound" },
] as const;

// ─── CRM stages ───

export const CRM_STAGES = [
  { id: "lead", label: "Leads", color: "bg-slate-500" },
  { id: "contacted", label: "Contactados", color: "bg-blue-500" },
  { id: "qualified", label: "Cualificados", color: "bg-cyan-500" },
  { id: "proposal", label: "Propuesta", color: "bg-purple-500" },
  { id: "negotiation", label: "Negociación", color: "bg-amber-500" },
  { id: "closed-won", label: "Ganados", color: "bg-green-500" },
  { id: "closed-lost", label: "Perdidos", color: "bg-red-500" },
] as const;

// ─── Project labels ───

export const PROJECT_STATUS_LABELS = {
  production: "Producción",
  beta: "Beta",
  development: "Desarrollo",
} as const;

export const PROJECT_CATEGORY_LABELS = {
  web: "Web",
  desktop: "Desktop",
  mobile: "Móvil",
  ai: "IA",
  automation: "Automatización",
} as const;

export const PROJECT_COLORS = [
  { label: "Índigo", value: "#6366f1" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Esmeralda", value: "#10b981" },
  { label: "Ámbar", value: "#f59e0b" },
  { label: "Rojo", value: "#ef4444" },
  { label: "Violeta", value: "#8b5cf6" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Lima", value: "#84cc16" },
  { label: "Naranja", value: "#f97316" },
  { label: "Azul", value: "#3b82f6" },
] as const;

// ─── Real-time config ───

export const VISITORS_REFRESH_INTERVAL_MS = 5_000;
export const MAX_VISIBLE_VISITORS = 30;

// ─── Contact info ───

export const CONTACT_EMAIL = "contacto@praxialab.dev";
export const CONTACT_PHONE = "+34 600 000 000";
export const CONTACT_LOCATION = "Madrid, España";
