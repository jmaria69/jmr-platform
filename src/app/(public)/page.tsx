'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projects } from '@/lib/projects';

import { PraxiaLabLogo } from "@/components/praxia-lab-logo";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  const featuredProjects = [
    projects.find(p => p.id === 'olga-ai'),
    projects.find(p => p.id === 'admin-app'),
    projects.find(p => p.id === 'crm-it'),
  ].filter(Boolean);

  const totalUsers = projects.reduce((sum, p) => sum + (p.metrics?.users || 0), 0);
  const avgRating = (projects.reduce((sum, p) => sum + (p.metrics?.rating || 0), 0) / projects.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <div className="inline-block px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 backdrop-blur">
                <span className="text-sm text-purple-400">✨ Praxia Labs: Agentes IA en Producción</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  From Prompt
                </span>
                <br />
                <span className="text-white">to Praxis</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Agentes de IA que no solo hablan, <span className="text-cyan-400 font-semibold">ejecutan</span>. Transformamos la intención de tu empresa en automatización real, 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/admin/dashboard"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105 text-center"
              >
                🚀 Ir al Dashboard
              </Link>
              <a href="#como-funciona" className="px-8 py-4 rounded-lg border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition text-center">
                Ver Cómo Funciona →
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-500/20">
              <div>
                <div className="text-3xl font-bold text-cyan-400">{featuredProjects.length}+</div>
                <div className="text-sm text-gray-400">En Producción</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">{Math.round(totalUsers / 100)}k+</div>
                <div className="text-sm text-gray-400">Usuarios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">⭐ {avgRating}</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative h-96 hidden lg:block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 backdrop-blur-md p-8">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 to-transparent"></div>

              <div className="relative h-full flex flex-col justify-around">
                <div className="absolute left-4 top-8 p-4 rounded-lg bg-slate-900/80 border border-purple-500/30 backdrop-blur w-40 animate-float">
                  <div className="text-xs text-purple-400 font-mono">{'const agente ='}</div>
                  <div className="text-xs text-cyan-400 mt-2">new Praxia Agent()</div>
                </div>

                <div className="absolute right-4 top-24 p-4 rounded-lg bg-slate-900/80 border border-cyan-500/30 backdrop-blur w-40 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="text-xs text-cyan-400 font-mono">{'// execute()'}</div>
                  <div className="text-xs text-purple-400 mt-2">→ 24/7 Automático</div>
                </div>

                <div className="absolute left-8 bottom-12 p-4 rounded-lg bg-slate-900/80 border border-cyan-500/30 backdrop-blur w-44 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-xs text-green-400">✅ AdminApp</div>
                  <div className="text-xs text-green-400 mt-1">✅ Core OPS</div>
                  <div className="text-xs text-green-400 mt-1">✅ OLGA.ai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DE LA TEORÍA A LA PRAXIS */}
      <section id="como-funciona" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            De la Teoría a la Praxis
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
            Transformamos prompts en agentes autónomos que ejecutan tareas complejas sin intervención humana
          </p>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/30 via-cyan-600/30 to-purple-600/30 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/30 to-purple-600/10 border-2 border-purple-500/50 mb-6 mx-auto hover:border-purple-400 transition group">
                  <div className="text-4xl group-hover:scale-125 transition">💬</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">El Prompt</h3>
                <p className="text-gray-400">Describe lo que quieres automatizar en lenguaje natural.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/30 via-cyan-600/20 to-cyan-600/10 border-2 border-cyan-500/50 mb-6 mx-auto hover:border-cyan-400 transition group">
                  <div className="text-4xl group-hover:scale-125 transition">⚙️</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">El Agente</h3>
                <p className="text-gray-400">IA razona, planifica y orquesta con APIs integradas.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600/30 to-cyan-600/10 border-2 border-cyan-500/50 mb-6 mx-auto hover:border-cyan-300 transition group">
                  <div className="text-4xl group-hover:scale-125 transition">🚀</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">La Praxis</h3>
                <p className="text-gray-400">Ejecuta 24/7 sin intervención, resultados reales.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
            <div className="p-8 rounded-2xl border border-purple-500/30 bg-slate-900/50 backdrop-blur hover:border-purple-500/60 transition">
              <h3 className="text-2xl font-bold mb-4">La Teoría</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>✓ LLMs entrenados</li>
                <li>✓ Razonamiento complejo</li>
                <li>✗ No actúa por sí solo</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl border border-cyan-500/30 bg-slate-900/50 backdrop-blur hover:border-cyan-500/60 transition">
              <h3 className="text-2xl font-bold mb-4">La Praxis</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>✓ APIs + Sistemas reales</li>
                <li>✓ Decisiones autónomas</li>
                <li>✓ Teoría + Acción</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS DESTACADOS */}
      <section id="proyectos" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Proyectos Destacados
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
            Soluciones en producción que transforman industrias
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project?.id}
                className="group relative p-8 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
              >
                <h3 className="text-xl font-bold mb-3">{project?.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{project?.description}</p>

                <div className="flex gap-6 pt-6 border-t border-purple-500/20">
                  {project?.metrics?.users && (
                    <div>
                      <div className="text-lg font-bold text-purple-400">{project.metrics.users}</div>
                      <div className="text-xs text-gray-400">Usuarios</div>
                    </div>
                  )}
                  {project?.metrics?.rating && (
                    <div>
                      <div className="text-lg font-bold text-cyan-400">⭐ {project.metrics.rating}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Link href={`/proyectos/${project?.id}`} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">
                    Ver detalles →
                  </Link>
                  {project?.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 font-semibold">
                      Ver en vivo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CONTACTO */}
      <section id="contacto" className="relative py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Listo para Transformar
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Demo gratuita en 15 minutos. Agentes IA 24/7.
          </p>

          <div className="p-8 rounded-2xl border border-purple-500/30 bg-slate-900/80 backdrop-blur-xl">
            {submitted ? (
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-gray-400">¡Gracias! Te contactaremos en {email}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Reservar Demo
                </button>
              </form>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            O contáctanos directamente: <a href="mailto:jmaria.romero@praxialabs.com" className="text-purple-400 hover:text-purple-300 font-semibold">jmaria.romero@praxialabs.com</a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-6 border-t border-purple-500/20 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <PraxiaLabLogo size={24} />
            <span className="font-bold">Praxia Labs</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Praxia Labs. From Prompt to Praxis.</p>
          {/* resto */}
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}