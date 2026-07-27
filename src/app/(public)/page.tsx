import Link from 'next/link';
import { MessageSquare, Bot, Zap, ArrowRight, ExternalLink, Package, Timer, TrendingUp, Shield } from 'lucide-react';
import { findAllProjects } from '@/lib/repositories/projects.repository';
import { PraxiaLabLogo } from "@/components/praxia-lab-logo";
import { AgentFlowWidget } from "@/components/public/agent-flow";
import { Nis2Calculator } from "@/components/public/nis2-calculator";
import { ContactForm } from "@/components/public/contact-form";
import { PRODUCTS } from '@/content/products';

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
    cliente: "Gestión de comunidades",
    agente: "VERA + QUENTIN",
    problema: "Las gestoras de fincas acumulan cientos de facturas y tareas administrativas al mes, casi todo a mano.",
    solucion: "El agente VERA clasifica, valida y registra cada factura automáticamente. QUENTIN anticipa averías en ascensores e infraestructura.",
    resultado: "Demo funcional propia: procesa y clasifica facturas sin intervención, con módulo financiero y avisos predictivos.",
    saving: "Demo",
    tag: "AdminApp Maestro",
  },
  {
    icon: MessageSquare,
    color: "#00d4ff",
    cliente: "Operaciones y back-office",
    agente: "OLGA.ai",
    problema: "Coordinar email, tareas y Google Workspace entre departamentos consume horas cada día.",
    solucion: "OLGA categoriza correos, redacta respuestas, crea tareas y sincroniza Google Workspace desde un bot de Telegram.",
    resultado: "Sistema propio en producción 24/7, con panel en vivo de contenedores, tokens y escudo de seguridad.",
    saving: "En vivo",
    tag: "OLGA.ai",
  },
  {
    icon: Shield,
    color: "#dc2626",
    cliente: "Seguridad IT",
    agente: "SIAM",
    problema: "Detectar y clasificar amenazas de red a mano deja huecos y respuestas lentas.",
    solucion: "SIAM monitoriza el tráfico en tiempo real, clasifica cada evento por severidad y genera alertas con protocolo de acción.",
    resultado: "Demo funcional propia: detección en tiempo real, panel de incidentes y exportación de logs.",
    saving: "Beta",
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
    { value: `${productionCount}`, label: "Sistemas propios en producción", icon: Package, color: "text-cyan-400" },
    { value: "< 48h", label: "De idea a agente operativo", icon: Timer, color: "text-cyan-400" },
    { value: "A medida", label: "Sin plantillas, sin humo", icon: TrendingUp, color: "text-purple-400" },
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
                El trabajo que hacéis a mano{' '}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ya no hace falta hacerlo.
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Construyo sistemas para pymes españolas: seguridad, operaciones y administración.{' '}
                <span className="text-cyan-400 font-semibold">Uno por uno, hasta que funciona.</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/15 border border-red-500/25">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">Exposición NIS2</span>
            </div>
            <h2 className="font-display text-4xl text-white leading-tight">
              ¿Te aplica la{' '}
              <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                directiva NIS2
              </span>
              ?
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Indica tu sector, tu plantilla y tu facturación. Te decimos si estás dentro del ámbito
              de la directiva, qué exposición estimada tienes y qué te exigirá — con las fuentes
              citadas, sin formularios.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="h-px flex-1 bg-white/5" />
              <span>Estimación orientativa. España aún no ha transpuesto la directiva.</span>
              <span className="h-px flex-1 bg-white/5" />
            </div>
          </div>
          <Nis2Calculator />
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
            <h2 className="font-display text-4xl text-white mb-4">Lo que construimos</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Sistemas propios que ya funcionan. Te los enseñamos en vivo y adaptamos el mismo enfoque a tu proceso.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASOS.map(caso => (
              <div
                key={caso.tag}
                className="relative rounded-2xl border border-white/8 bg-white dark:bg-[#0d0d2b]/60 p-6 flex flex-col"
              >
                <div className="h-0.5 rounded-full mb-5" style={{ background: `linear-gradient(90deg, ${caso.color}, ${caso.color}30, transparent)` }} />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${caso.color}18`, color: caso.color, border: `1px solid ${caso.color}30` }}>
                    {caso.tag}
                  </span>
                  <span className="font-display text-xl font-black" style={{ color: caso.color }}>{caso.saving}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Caso de uso</p>
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
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: caso.color }}>Qué demuestra</p>
                    <p className="text-xs text-white font-semibold leading-relaxed">{caso.resultado}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">
            * Sistemas desarrollados por Praxia Labs. Demos disponibles bajo petición.
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

      {/* ── PRODUCTOS ── */}
      <section className="py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-white mb-4">Tres productos</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Cada uno resuelve un problema concreto de un tipo concreto de empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group relative rounded-2xl border p-6 flex flex-col transition-all hover:scale-[1.02] surface-card"
                style={{ borderColor: p.foco ? `${p.color}50` : 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-0.5 rounded-full mb-5"
                  style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}30, transparent)` }}
                />
                <span
                  className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-4"
                  style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}
                >
                  {p.badge}
                </span>
                <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                  {p.titular}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{p.promesa}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: p.color }}>
                  {p.nombre} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ── */}
      <section id="proyectos" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-white mb-4">Agentes en producción</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sistemas reales que hemos construido y mantenemos en producción.
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
            <Link href="/laboratorio" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition font-semibold">
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
                  <Link href="/laboratorio" className="hover:text-white transition">Laboratorio</Link>
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
