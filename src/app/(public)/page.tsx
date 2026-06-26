import Link from 'next/link';
import { MessageSquare, Bot, Zap, ArrowRight, ExternalLink, Clock, Package, Timer, TrendingUp, Shield } from 'lucide-react';
import { findAllProjects } from '@/lib/repositories/projects.repository';
import { PraxiaLabLogo } from "@/components/praxia-lab-logo";
import { AgentFlowWidget } from "@/components/public/agent-flow";
import { DiagnosticoWidget } from "@/components/public/diagnostico";
import { ContactForm } from "@/components/public/contact-form";

export const dynamic = "force-dynamic";

const FEATURED_IDS = ['olga-ai', 'admin-app', 'crm-it', 'generador-ideas'];

const PUBLIC_PROJECT_IDS = new Set([
  "olga-ai", "admin-app", "crm-it", "generador-ideas",
  "app-voz", "app-mejores-productos", "siam", "saludapp",
]);

const STEPS = [
  {
    icon: MessageSquare,
    color: "purple",
    title: "Diagnóstico de 15 min",
    body: "Nos cuentas qué haces a mano hoy: aprobaciones, informes, seguimiento de clientes. Sin tecnicismos.",
  },
  {
    icon: Bot,
    color: "cyan",
    title: "Configuramos el agente",
    body: "Diseñamos un agente IA conectado a tus sistemas actuales — ERP, email, Google Workspace. Tú lo revisas antes de activarlo.",
  },
  {
    icon: Zap,
    color: "teal",
    title: "Funciona desde el lunes",
    body: "Operativo en menos de 48h. Si algo falla, lo sabemos antes que tú y lo resolvemos. Soporte real en menos de 2 horas.",
  },
  {
    icon: TrendingUp,
    color: "purple",
    title: "Medimos y mejoramos",
    body: "Dashboard en tiempo real con horas ahorradas, procesos completados e incidencias. Revisión mensual incluida.",
  },
];

const STEP_COLORS: Record<string, string> = {
  purple: "124,58,237",
  cyan: "0,212,255",
  teal: "6,255,165",
};

const STACK = [
  "Claude API", "FastAPI", "Python", "Next.js", "Docker",
  "PostgreSQL", "n8n", "Vercel", "Google Workspace", "Telegram",
  "Resend", "Redis", "Twilio", "LangChain", "Neon DB",
];

const CASOS = [
  {
    icon: Bot,
    color: "#7c3aed",
    cliente: "Gestora de comunidades",
    agente: "VERA + QUENTIN",
    problema: "Procesaban 200+ facturas al mes a mano. 3 días para cerrar contabilidad mensual.",
    solucion: "Agente VERA clasifica, valida y registra cada factura automáticamente. QUENTIN predice averías antes de que ocurran.",
    resultado: "De 3 días a 4 horas. 96% de facturas procesadas sin intervención humana.",
    saving: "52h/mes",
    tag: "AdminApp Maestro",
  },
  {
    icon: MessageSquare,
    color: "#00d4ff",
    cliente: "Startup de operaciones",
    agente: "OLGA.ai",
    problema: "El equipo pasaba 2h diarias respondiendo emails y coordinando tareas entre departamentos.",
    solucion: "OLGA categoriza correos, redacta respuestas, crea tareas en Notion y sincroniza Google Workspace sin supervisión.",
    resultado: "40 horas/mes recuperadas. Tiempo de respuesta a clientes: de 6h a 18 minutos.",
    saving: "40h/mes",
    tag: "OLGA.ai",
  },
  {
    icon: Shield,
    color: "#dc2626",
    cliente: "Empresa de servicios IT",
    agente: "SIAM",
    problema: "Incidentes de seguridad detectados manualmente, con retrasos de hasta 4 horas en respuesta.",
    solucion: "SIAM monitoriza tráfico en tiempo real, clasifica amenazas por severidad y genera alertas automáticas con protocolo de acción.",
    resultado: "Tiempo de detección: de 4h a 3 minutos. Zero falsos negativos en primer trimestre.",
    saving: "28h/mes",
    tag: "SIAM · Beta",
  },
];

export default async function Home() {
  // Fuente única de verdad: DB (con fallback al seed si la DB falla)
  const allProjects = await findAllProjects();

  const productionCount = allProjects.filter(
    (p) => PUBLIC_PROJECT_IDS.has(p.id) || p.category === "ai" || p.category === "automation"
  ).filter(p => p.status === 'production').length;

  const featuredProjects = FEATURED_IDS
    .map(id => allProjects.find(p => p.id === id))
    .filter(Boolean);

  const STATS = [
    { value: `${productionCount}`, label: "Proyectos en producción", icon: Package, color: "text-cyan-400" },
    { value: "40h+", label: "Ahorro mensual por cliente", icon: Clock, color: "text-purple-400" },
    { value: "< 48h", label: "De idea a agente operativo", icon: Timer, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-purple-300">
                  {productionCount} agentes activos en producción
                </span>
              </div>
              <h1 className="font-display text-5xl lg:text-6xl leading-[1.08] text-white">
                Automatiza tu empresa{' '}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  con agentes IA.
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Facturas, aprobaciones, seguimiento de clientes — en automático, sin código, sin consultor.{' '}
                <span className="text-cyan-400 font-semibold">Operativo en menos de 48 horas.</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contacto" className="px-8 py-4 rounded-lg shimmer-btn font-semibold text-white text-center transition-transform hover:scale-105">
                Reservar demo gratuita
              </Link>
              <Link href="/precios" className="px-8 py-4 rounded-lg border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition text-center">
                Ver precios
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-500/20">
              {STATS.map(({ value, label, icon: Icon, color }) => (
                <div key={label}>
                  <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <AgentFlowWidget />
          </div>
        </div>
      </section>

      {/* ── DIAGNÓSTICO INTERACTIVO ── */}
      <section className="relative py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-600/15 border border-cyan-500/25">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Nuevo · Solo en Praxia Labs</span>
            </div>
            <h2 className="font-display text-4xl text-white leading-tight">
              Descubre cuánto ahorraría{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                tu empresa
              </span>{' '}
              en 90 segundos.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Selecciona tu sector, el proceso que más tiempo te roba y el tamaño de tu equipo.
              El diagnóstico te dice qué agente aplicar y cuántas horas recuperas — al instante,
              sin formularios, sin esperar.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="h-px flex-1 bg-white/5" />
              <span>Calculado sobre datos reales de implantaciones en producción</span>
              <span className="h-px flex-1 bg-white/5" />
            </div>
          </div>
          <DiagnosticoWidget />
        </div>
      </section>

      {/* ── STACK / LOGOS ── */}
      <section className="py-12 px-6 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-600 mb-6">
            Construido con herramientas de producción real
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {STACK.map(tech => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 border border-white/6 bg-white/3 hover:text-gray-300 hover:border-white/15 transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASOS DE ESTUDIO ── */}
      <section className="py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-white mb-4">Resultados reales</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              No decimos "podría ahorrar X horas". Decimos cuántas hemos ahorrado ya, en qué empresa, con qué agente.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASOS.map(caso => (
              <div
                key={caso.tag}
                className="relative rounded-2xl border border-white/8 bg-[#0d0d2b]/60 p-6 flex flex-col"
              >
                <div className="h-0.5 rounded-full mb-5" style={{ background: `linear-gradient(90deg, ${caso.color}, ${caso.color}30, transparent)` }} />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${caso.color}18`, color: caso.color, border: `1px solid ${caso.color}30` }}>
                    {caso.tag}
                  </span>
                  <span className="font-display text-xl font-black" style={{ color: caso.color }}>{caso.saving}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cliente</p>
                <p className="text-sm text-white font-semibold mb-4">{caso.cliente}</p>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-0.5">Problema</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{caso.problema}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-0.5">Solución</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{caso.solucion}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: `${caso.color}10`, border: `1px solid ${caso.color}20` }}>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: caso.color }}>Resultado</p>
                    <p className="text-xs text-white font-semibold leading-relaxed">{caso.resultado}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">
            * Datos de clientes reales. Nombres omitidos por confidencialidad.
          </p>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-white mb-4">
              De la reunión al agente operativo
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sin código. Sin meses de implantación. Sin depender de un departamento IT.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {STEPS.map(({ icon: Icon, color, title, body }, i) => {
              const rgb = STEP_COLORS[color];
              return (
                <div
                  key={title}
                  className="relative p-7 rounded-2xl border hover:border-purple-500/40 transition-all surface-card"
                  style={{ borderColor: `rgba(${rgb},0.2)` }}
                >
                  <div
                    className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border"
                    style={{ background: `rgba(${rgb},0.9)`, borderColor: `rgba(${rgb},0.4)` }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                    style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.25)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: `rgb(${rgb})` }} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-12 text-center text-gray-400 text-sm">
            ¿Con dudas?{' '}
            <Link href="/contacto" className="text-purple-400 hover:text-purple-300 font-semibold">
              Hablamos en 15 minutos
            </Link>
          </p>
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ── */}
      <section id="proyectos" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-white mb-4">Agentes en producción</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No demos ni prototipos — sistemas reales corriendo para clientes reales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => project && (
              <div key={project.id} className="project-card-v2 group p-6 rounded-2xl transition-all">
                <div className="h-0.5 w-full rounded-full mb-5"
                  style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}30` }}>
                        {project.status === 'production' ? 'Producción' : project.status === 'beta' ? 'Beta' : 'Dev'}
                      </span>
                      <span className="badge-tech">{project.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black tracking-widest shrink-0"
                    style={{ background: `${project.color}18`, color: project.color }}>
                    {project.category === 'ai' ? 'AI' : project.category === 'automation' ? 'AU' : 'WB'}
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 4).map(t => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-400 font-medium">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Link href={`/proyectos/${project.id}`} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition">
                    Ver detalles <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 font-semibold transition">
                      Ver en vivo <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/proyectos" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition font-semibold">
              Ver todos los proyectos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-4">Reserva una demo gratuita</h2>
            <p className="text-gray-400">
              15 minutos. Te mostramos en directo cómo automatizaríamos un proceso de tu empresa.
            </p>
          </div>
          <div className="surface-card p-8 rounded-2xl border border-purple-500/20">
            <ContactForm />
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            O escríbenos directamente a{' '}
            <a href="mailto:jmaria.romero@praxialabs.com" className="text-purple-400 hover:text-purple-300 font-semibold">
              jmaria.romero@praxialabs.com
            </a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-16 px-6 border-t border-purple-500/20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <PraxiaLabLogo size={24} />
                <span className="font-display font-bold text-white text-base">Praxia Labs</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Estudio de agentes IA especializado en automatización de procesos empresariales para PYMEs españolas.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-16 gap-y-8 text-sm">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Producto</p>
                <nav className="flex flex-col gap-2 text-gray-400">
                  <Link href="/proyectos" className="hover:text-white transition">Proyectos</Link>
                  <Link href="/precios" className="hover:text-white transition">Precios</Link>
                  <Link href="/#como-funciona" className="hover:text-white transition">Cómo funciona</Link>
                  <Link href="/acerca-de" className="hover:text-white transition">Acerca de</Link>
                </nav>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Contacto</p>
                <nav className="flex flex-col gap-2 text-gray-400">
                  <Link href="/contacto" className="hover:text-white transition">Reservar demo</Link>
                  <a href="mailto:jmaria.romero@praxialabs.com" className="hover:text-white transition">
                    jmaria.romero@praxialabs.com
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2026 Praxia Labs. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-700">Madrid, España — Automatización con IA · RGPD compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
