import type { CRMContact } from "@/types";
import type { DashboardStats } from "@/lib/repositories/dashboard.repository";

/**
 * Datos ficticios exclusivos de las rutas públicas /demo/*. A diferencia de
 * `mock-data.ts` (fallback "honesto" a vacío para /admin cuando no hay datos
 * reales), aquí SÍ queremos números y contactos de mentira, creíbles y
 * claramente inventados — es lo que promete el badge "Modo Demo — Datos
 * simulados". Nunca usar `findAllContacts()` / `getDashboardStats()` reales
 * en /demo: expondrían datos de clientes reales o saldrían a cero.
 */

// ─── Dashboard / Analytics ──────────────────────────────────────────────────

function dailyLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// Onda determinista (sin Math.random) para que el gráfico tenga forma
// realista — fin de semana más bajo — sin depender de una semilla aleatoria.
function demoVisitors(daysAgo: number): number {
  const dow = new Date(dailyLabel(daysAgo)).getUTCDay();
  const weekend = dow === 0 || dow === 6;
  const base = weekend ? 55 : 95;
  const wave = Math.round(20 * Math.sin(daysAgo / 3));
  return Math.max(30, base + wave);
}

const trafficByDay = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  return { label: dailyLabel(daysAgo), visitors: demoVisitors(daysAgo) };
});

const trafficByMonth = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (5 - i));
  const label = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  return { label, visitors: 1800 + i * 220 };
});

const trafficByYear = (() => {
  const y = new Date().getFullYear();
  return [
    { label: String(y - 1), visitors: 14200 },
    { label: String(y), visitors: 16850 },
  ];
})();

const deviceData = [
  { device: "desktop", count: 620 },
  { device: "mobile", count: 410 },
  { device: "tablet", count: 70 },
];

const osData = [
  { os: "Windows", count: 380 },
  { os: "macOS", count: 240 },
  { os: "iOS", count: 220 },
  { os: "Android", count: 190 },
  { os: "Linux", count: 70 },
];

const monthlyVisitors = trafficByDay.reduce((sum, d) => sum + d.visitors, 0);

const trafficByCountry = [
  { country: "España", visitors: Math.round(monthlyVisitors * 0.45) },
  { country: "México", visitors: Math.round(monthlyVisitors * 0.15) },
  { country: "Argentina", visitors: Math.round(monthlyVisitors * 0.12) },
  { country: "Colombia", visitors: Math.round(monthlyVisitors * 0.08) },
  { country: "EE.UU.", visitors: Math.round(monthlyVisitors * 0.07) },
];

export const demoDashboardStats: DashboardStats = {
  visitorsToday: demoVisitors(0),
  visitorsWeek: trafficByDay.slice(-7).reduce((sum, d) => sum + d.visitors, 0),
  visitorsMonth: monthlyVisitors,
  activeNow: 4,
  revenueTotal: 52400,
  revenueMonth: 8950,
  conversionRate: 3.8,
  avgSessionDuration: 187,
  bounceRate: 34.2,
  trafficByDay,
  trafficByMonth,
  trafficByYear,
  deviceData,
  osData,
  trafficByCountry,
};

// ─── CRM ─────────────────────────────────────────────────────────────────

export const demoCrmContacts: CRMContact[] = [
  {
    id: "demo-1",
    name: "Laura Gómez",
    email: "laura.gomez@ficticia-retail.example",
    phone: "+34 611 222 333",
    company: "Ficticia Retail S.L.",
    source: "web",
    stage: "lead",
    value: 4200,
    notes: "Interesada en automatizar la gestión de pedidos.",
    tags: ["retail", "automatizacion"],
    lastContact: new Date(Date.now() - 2 * 86400000),
    createdAt: new Date(Date.now() - 9 * 86400000),
    interactions: [
      { id: "i-1", type: "email", date: new Date(Date.now() - 2 * 86400000), summary: "Envío de propuesta inicial." },
    ],
  },
  {
    id: "demo-2",
    name: "Marc Soler",
    email: "marc.soler@demo-logistics.example",
    phone: "+34 622 333 444",
    company: "Demo Logistics",
    source: "referral",
    stage: "contacted",
    value: 9800,
    notes: "Referido por cliente actual, busca CRM + facturación.",
    tags: ["logistica"],
    lastContact: new Date(Date.now() - 4 * 86400000),
    createdAt: new Date(Date.now() - 14 * 86400000),
    interactions: [
      { id: "i-2", type: "call", date: new Date(Date.now() - 4 * 86400000), summary: "Llamada de descubrimiento, 20 min." },
    ],
  },
  {
    id: "demo-3",
    name: "Irene Vidal",
    email: "irene.vidal@sample-clinic.example",
    phone: "+34 633 444 555",
    company: "Sample Clínica Dental",
    source: "social",
    stage: "qualified",
    value: 6300,
    notes: "Quiere recordatorios automáticos de citas por WhatsApp.",
    tags: ["salud", "whatsapp"],
    lastContact: new Date(Date.now() - 1 * 86400000),
    createdAt: new Date(Date.now() - 20 * 86400000),
    interactions: [
      { id: "i-3", type: "meeting", date: new Date(Date.now() - 6 * 86400000), summary: "Demo del producto." },
      { id: "i-4", type: "email", date: new Date(Date.now() - 1 * 86400000), summary: "Envío de condiciones." },
    ],
  },
  {
    id: "demo-4",
    name: "Pablo Nieto",
    email: "pablo.nieto@acme-demo.example",
    phone: "+34 644 555 666",
    company: "ACME Demo S.A.",
    source: "campaign",
    stage: "proposal",
    value: 15200,
    notes: "Propuesta enviada para automatización de facturas.",
    tags: ["facturas", "enterprise"],
    lastContact: new Date(Date.now() - 3 * 86400000),
    createdAt: new Date(Date.now() - 25 * 86400000),
    interactions: [
      { id: "i-5", type: "meeting", date: new Date(Date.now() - 10 * 86400000), summary: "Reunión con dirección." },
      { id: "i-6", type: "note", date: new Date(Date.now() - 3 * 86400000), summary: "Ajuste de alcance en propuesta." },
    ],
  },
  {
    id: "demo-5",
    name: "Sara Molina",
    email: "sara.molina@sample-hotel.example",
    phone: "+34 655 666 777",
    company: "Sample Hotel Group",
    source: "direct",
    stage: "negotiation",
    value: 21000,
    notes: "Negociando alcance de agentes IA para atención al cliente.",
    tags: ["hosteleria", "agentes-ia"],
    lastContact: new Date(Date.now() - 1 * 86400000),
    createdAt: new Date(Date.now() - 30 * 86400000),
    interactions: [
      { id: "i-7", type: "call", date: new Date(Date.now() - 5 * 86400000), summary: "Revisión de condiciones económicas." },
      { id: "i-8", type: "meeting", date: new Date(Date.now() - 1 * 86400000), summary: "Negociación final." },
    ],
  },
  {
    id: "demo-6",
    name: "Diego Ferrer",
    email: "diego.ferrer@demo-studio.example",
    phone: "+34 666 777 888",
    company: "Demo Studio Creativo",
    source: "web",
    stage: "closed-won",
    value: 7400,
    notes: "Cliente cerrado, onboarding en curso.",
    tags: ["creativo"],
    lastContact: new Date(Date.now() - 7 * 86400000),
    createdAt: new Date(Date.now() - 45 * 86400000),
    interactions: [
      { id: "i-9", type: "demo", date: new Date(Date.now() - 20 * 86400000), summary: "Demo técnica." },
      { id: "i-10", type: "email", date: new Date(Date.now() - 7 * 86400000), summary: "Confirmación de contrato." },
    ],
  },
  {
    id: "demo-7",
    name: "Nuria Campos",
    email: "nuria.campos@sample-gym.example",
    phone: "+34 677 888 999",
    company: "Sample Gym Chain",
    source: "referral",
    stage: "closed-lost",
    value: 3100,
    notes: "Optó por otra solución más económica.",
    tags: ["fitness"],
    lastContact: new Date(Date.now() - 15 * 86400000),
    createdAt: new Date(Date.now() - 40 * 86400000),
    interactions: [
      { id: "i-11", type: "call", date: new Date(Date.now() - 15 * 86400000), summary: "Cierre negativo, presupuesto." },
    ],
  },
];
