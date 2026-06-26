import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, Cpu, Shield } from 'lucide-react';
import { PraxiaLabLogo } from '@/components/praxia-lab-logo';

export const metadata: Metadata = {
  title: 'Acerca de — Praxia Labs',
  description: 'Somos un estudio de automatización con IA para pymes. Diseñamos, construimos y mantenemos agentes que ejecutan procesos reales en tu empresa.',
};

const valores = [
  {
    icon: Bot,
    title: 'Resultados antes que tecnología',
    description: 'No vendemos IA porque está de moda. La usamos cuando resuelve un problema concreto y medible en tu empresa.',
  },
  {
    icon: Shield,
    title: 'Soporte real',
    description: 'Respondemos en menos de 2 horas, en horario laboral. Sin bots de primer nivel ni tickets que tardan días.',
  },
  {
    icon: Cpu,
    title: 'Sin código para el cliente',
    description: 'Tú describes el proceso. Nosotros lo construimos, lo probamos y lo mantenemos. Sin formación técnica necesaria.',
  },
];

export default function AcercaDePage() {
  return (
    <div className="min-h-screen bg-transparent text-[#e8e8f0]">
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <PraxiaLabLogo size={48} />
            <div>
              <h1 className="text-2xl font-black text-white">Praxia Labs</h1>
              <p className="text-sm text-gray-400">Madrid, España</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Automatizamos los procesos que<br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              todavía haces a mano.
            </span>
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            Somos un estudio especializado en automatización con IA para pymes. Diseñamos, construimos y mantenemos agentes inteligentes que ejecutan procesos reales en tu empresa: facturación, aprobaciones, seguimiento de clientes, generación de informes.
          </p>
        </div>

        {/* Quiénes somos */}
        <div className="mb-16 p-8 rounded-2xl border border-purple-500/20 glass">
          <h3 className="text-2xl font-bold text-white mb-4">Por qué existimos</h3>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              La mayoría de software de automatización está diseñado para grandes empresas con equipos de IT. Las pymes se quedan fuera o pagan soluciones que nadie sabe cómo configurar.
            </p>
            <p>
              Praxia Labs nació para cambiar eso. Trabajamos directamente con el responsable del proceso — sin intermediarios, sin manuales de 200 páginas — y entregamos automatizaciones que funcionan desde el primer día.
            </p>
            <p>
              Nuestra forma de trabajar es sencilla: escuchamos, diseñamos, construimos y nos quedamos contigo el tiempo que haga falta. Si algo falla a las 3 de la madrugada, lo sabemos antes que tú.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Cómo trabajamos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valores.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl border border-purple-500/20 glass hover:border-purple-500/40 transition">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mb-16 p-8 rounded-2xl border border-cyan-500/20 glass">
          <h3 className="text-2xl font-bold text-white mb-4">Stack tecnológico</h3>
          <p className="text-gray-400 mb-6">
            Usamos herramientas modernas y bien probadas. Sin reinventar la rueda.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'Claude API', 'PostgreSQL', 'Docker', 'Vercel', 'LangChain', 'Resend', 'Prisma'].map(tech => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl border border-purple-500/30 glass-strong">
          <h3 className="text-2xl font-bold text-white mb-3">¿Tienes un proceso que automatizar?</h3>
          <p className="text-gray-400 mb-8">
            Reserva una demo de 15 minutos. Te mostramos exactamente cómo lo haríamos en tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
            >
              Reservar demo gratuita <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition"
            >
              Ver proyectos →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
