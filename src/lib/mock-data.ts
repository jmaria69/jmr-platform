import { Visitor, CRMContact, DashboardStats } from "@/types";

// --- Visitors (real-time simulation) ---
export function generateVisitors(count: number): Visitor[] {
  const countries = ["España", "México", "Argentina", "Colombia", "Chile", "USA", "UK", "Alemania"];
  const cities = ["Madrid", "CDMX", "Buenos Aires", "Bogotá", "Santiago", "New York", "London", "Berlin"];
  const devices: Visitor["device"][] = ["mobile", "tablet", "desktop"];
  const oses: Visitor["os"][] = ["iOS", "Android", "Windows", "macOS", "Linux"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Samsung Browser"];
  const pages = ["/", "/proyectos", "/proyectos/admin-app", "/proyectos/crm-it", "/contacto", "/proyectos/gws"];
  const referrers = ["Google", "Direct", "Twitter", "LinkedIn", "GitHub", "Reddit"];
  const projectIds = ["admin-app", "crm-it", "landing-inmobiliaria", "app-voz", "app-mejores-productos", "gws"];

  return Array.from({ length: count }, (_, i) => {
    const countryIdx = Math.floor(Math.random() * countries.length);
    return {
      id: `v-${Date.now()}-${i}`,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.*.***`,
      country: countries[countryIdx],
      city: cities[countryIdx],
      device: devices[Math.floor(Math.random() * devices.length)],
      os: oses[Math.floor(Math.random() * oses.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      duration: Math.floor(Math.random() * 600) + 10,
      projectViewed: Math.random() > 0.3 ? projectIds[Math.floor(Math.random() * projectIds.length)] : undefined,
    };
  });
}

// --- CRM Contacts ---
export const crmContacts: CRMContact[] = [
  {
    id: "c-1",
    name: "Carlos Mendoza",
    email: "carlos@techcorp.es",
    phone: "+34 612 345 678",
    company: "TechCorp España",
    source: "web",
    stage: "proposal",
    value: 15000,
    notes: "Interesado en AdminApp para su equipo de 50 personas.",
    tags: ["enterprise", "admin-app", "prioritario"],
    lastContact: new Date("2026-05-06"),
    createdAt: new Date("2026-04-15"),
    interactions: [
      { id: "i-1", type: "email", date: new Date("2026-04-15"), summary: "Primer contacto via formulario web" },
      { id: "i-2", type: "demo", date: new Date("2026-04-22"), summary: "Demo AdminApp - muy interesado" },
      { id: "i-3", type: "call", date: new Date("2026-05-06"), summary: "Llamada para cerrar propuesta de 50 licencias" },
    ],
  },
  {
    id: "c-2",
    name: "Laura Fernández",
    email: "laura@inmoglobal.com",
    phone: "+34 698 765 432",
    company: "InmoGlobal",
    source: "referral",
    stage: "negotiation",
    value: 8500,
    notes: "Necesita portal inmobiliario personalizado.",
    tags: ["inmobiliaria", "personalización", "urgente"],
    lastContact: new Date("2026-05-07"),
    createdAt: new Date("2026-03-20"),
    interactions: [
      { id: "i-4", type: "meeting", date: new Date("2026-03-25"), summary: "Reunión presencial en Madrid" },
      { id: "i-5", type: "email", date: new Date("2026-04-10"), summary: "Enviada propuesta personalizada" },
      { id: "i-6", type: "call", date: new Date("2026-05-07"), summary: "Negociando precio final" },
    ],
  },
  {
    id: "c-3",
    name: "Miguel Torres",
    email: "miguel@startupai.io",
    company: "StartupAI",
    source: "social",
    stage: "qualified",
    value: 25000,
    notes: "Quiere integrar AppVoz en su plataforma SaaS.",
    tags: ["api", "integración", "alto-valor"],
    lastContact: new Date("2026-05-05"),
    createdAt: new Date("2026-05-01"),
    interactions: [
      { id: "i-7", type: "email", date: new Date("2026-05-01"), summary: "Contacto via LinkedIn" },
      { id: "i-8", type: "call", date: new Date("2026-05-05"), summary: "Llamada exploratoria - gran potencial" },
    ],
  },
  {
    id: "c-4",
    name: "Ana García",
    email: "ana@ecommerce360.com",
    company: "Ecommerce360",
    source: "campaign",
    stage: "contacted",
    value: 4200,
    notes: "Interesada en MejoresProductos para su tienda online.",
    tags: ["ecommerce", "scraping", "precios"],
    lastContact: new Date("2026-05-03"),
    createdAt: new Date("2026-04-28"),
    interactions: [
      { id: "i-9", type: "email", date: new Date("2026-04-28"), summary: "Respondió a campaña de email" },
    ],
  },
  {
    id: "c-5",
    name: "Roberto Silva",
    email: "roberto@consultoria.mx",
    phone: "+52 55 1234 5678",
    company: "Consultoría Digital MX",
    source: "direct",
    stage: "lead",
    value: 12000,
    notes: "Suite GWS para 30 empleados.",
    tags: ["gws", "méxico", "consultoría"],
    lastContact: new Date("2026-05-08"),
    createdAt: new Date("2026-05-08"),
    interactions: [
      { id: "i-10", type: "note", date: new Date("2026-05-08"), summary: "Llegó por recomendación de Carlos Mendoza" },
    ],
  },
  {
    id: "c-6",
    name: "Elena Ruiz",
    email: "elena@mediapro.es",
    company: "MediaPro",
    source: "web",
    stage: "closed-won",
    value: 6800,
    notes: "Contrato cerrado - AdminApp + CRM.",
    tags: ["cerrado", "admin-app", "crm"],
    lastContact: new Date("2026-04-30"),
    createdAt: new Date("2026-02-10"),
    interactions: [
      { id: "i-11", type: "meeting", date: new Date("2026-02-15"), summary: "Primera demo" },
      { id: "i-12", type: "email", date: new Date("2026-03-01"), summary: "Propuesta enviada" },
      { id: "i-13", type: "call", date: new Date("2026-04-30"), summary: "Contrato firmado!" },
    ],
  },
];

// --- Dashboard Stats ---
export const dashboardStats: DashboardStats = {
  visitorsToday: 284,
  visitorsWeek: 1842,
  visitorsMonth: 7563,
  activeNow: 12,
  topProjects: [
    { name: "AdminApp Maestro", visits: 2340 },
    { name: "Core OPS", visits: 1890 },
    { name: "GWS Suite", visits: 1560 },
    { name: "MejoresProductos", visits: 980 },
    { name: "AppVoz", visits: 520 },
    { name: "Portal Inmobiliario", visits: 273 },
  ],
  deviceBreakdown: [
    { device: "Desktop", count: 4120 },
    { device: "Mobile", count: 2780 },
    { device: "Tablet", count: 663 },
  ],
  osBreakdown: [
    { os: "Windows", count: 2950 },
    { os: "macOS", count: 1680 },
    { os: "Android", count: 1520 },
    { os: "iOS", count: 1260 },
    { os: "Linux", count: 153 },
  ],
  revenueTotal: 52400,
  revenueMonth: 8950,
  conversionRate: 3.8,
  avgSessionDuration: 245,
  bounceRate: 34.2,
  trafficByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    visitors: Math.floor(Math.random() * 80) + (i >= 9 && i <= 20 ? 60 : 10),
  })),
  trafficByCountry: [
    { country: "España", visitors: 3200 },
    { country: "México", visitors: 1450 },
    { country: "Argentina", visitors: 890 },
    { country: "Colombia", visitors: 720 },
    { country: "Chile", visitors: 510 },
    { country: "USA", visitors: 480 },
    { country: "Otros", visitors: 313 },
  ],
};
