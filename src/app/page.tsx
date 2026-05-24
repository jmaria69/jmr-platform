import Link from "next/link";
import { ArrowRight, Bot, Cpu, Layers, Sparkles, TerminalSquare, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
              <svg width="36" height="36" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="al-go" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#f472b6"></stop><stop offset="50%" stopColor="#a78bfa"></stop><stop offset="100%" stopColor="#22d3ee"></stop></linearGradient><filter id="al-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="1"></feDropShadow></filter><filter id="al-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f472b6" floodOpacity="1"></feDropShadow></filter><filter id="al-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a78bfa" floodOpacity="1"></feDropShadow></filter><filter id="al-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" floodOpacity="1"></feDropShadow></filter><filter id="al-core"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.9"></feDropShadow></filter></defs><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45"></ellipse><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)"></ellipse><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)"></ellipse><circle cx="36" cy="36" r="5.5" fill="url(#al-go)" filter="url(#al-core)"></circle><circle cx="36" cy="36" r="2.5" fill="white" opacity="0.95"></circle><circle fill="#22d3ee" filter="url(#al-fc)"><animate attributeName="cx" dur="5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70"></animate><animate attributeName="cy" dur="5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36"></animate><animate attributeName="r" dur="2.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle><circle fill="#38bdf8" filter="url(#al-fc)" opacity="0.85"><animate attributeName="cx" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70"></animate><animate attributeName="cy" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36"></animate><animate attributeName="r" dur="1.7s" begin="-0.9s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle><circle fill="#f472b6" filter="url(#al-fp)"><animate attributeName="cx" dur="7s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53"></animate><animate attributeName="cy" dur="7s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65"></animate><animate attributeName="r" dur="2.5s" begin="-0.5s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle><circle fill="#e879f9" filter="url(#al-fp)" opacity="0.85"><animate attributeName="cx" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53"></animate><animate attributeName="cy" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65"></animate><animate attributeName="r" dur="1.9s" begin="-1.2s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle><circle fill="#a78bfa" filter="url(#al-fv)"><animate attributeName="cx" dur="6s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19"></animate><animate attributeName="cy" dur="6s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65"></animate><animate attributeName="r" dur="2.3s" begin="-1.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle><circle fill="#34d399" filter="url(#al-fg)" opacity="0.9"><animate attributeName="cx" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19"></animate><animate attributeName="cy" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65"></animate><animate attributeName="r" dur="2.0s" begin="-0.3s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"></animate></circle></svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
                Praxia<span className="text-sky-400">Labs</span>
              </span>
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em] mt-0.5">
                Laboratorio de Agentes IA
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#solutions" className="hover:text-foreground transition-colors">Soluciones</Link>
            <Link href="#technology" className="hover:text-foreground transition-colors">Tecnología</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">Nosotros</Link>
          </nav>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:jmaria.romero@praxialabs.com" 
              className="hidden md:inline-flex items-center justify-center text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contactar
            </a>
            <a 
              href="mailto:jmaria.romero@praxialabs.com"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shimmer-btn text-primary-foreground shadow px-4 py-2 hover:opacity-90"
            >
              Comenzar
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
          {/* Background grain & ambient light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl stagger-children">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 glow">
              <Zap className="mr-2 h-3.5 w-3.5" />
              <span>La próxima generación de automatización</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              From Prompt to <br className="hidden md:block" />
              <span className="text-gradient">Praxis.</span>
            </h1>
            
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              La Inteligencia Artificial ya no solo habla. Ahora <strong className="text-foreground font-semibold">ejecuta</strong>. 
              Transformamos la intención de tu empresa en agentes autónomos reales.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a 
                href="mailto:jmaria.romero@praxialabs.com"
                className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors h-12 px-8 shimmer-btn text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] w-full sm:w-auto"
              >
                Inicia tu Laboratorio
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a 
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors h-12 px-8 border border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground backdrop-blur-sm w-full sm:w-auto"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>
        </section>

        {/* Transition Section (Theory -> Praxis) */}
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              
              {/* Theory */}
              <div className="glass-strong rounded-2xl p-8 border-gradient flex flex-col h-full glow-hover transition-all">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-6">
                  <TerminalSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-muted-foreground">La Teoría</h3>
                <p className="text-muted-foreground/80 leading-relaxed">
                  Los LLMs tradicionales (como ChatGPT) son pura teoría. Tienen conocimiento, pero no pueden actuar en el mundo real ni usar tus herramientas por ti.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-border via-primary/50 to-border relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Praxis */}
              <div className="glass-strong rounded-2xl p-8 border border-primary/30 relative overflow-hidden flex flex-col h-full shadow-[0_0_30px_rgba(168,85,247,0.1)] glow-hover transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 relative z-10 border border-primary/30">
                  <Bot className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground relative z-10">La Praxis</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  Agentes autónomos que toman decisiones, usan APIs, gestionan ERPs y completan flujos de trabajo completos. De la idea, a la acción.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-24 border-t border-border/50 relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Arquitectura de Agentes</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Sistemas diseñados para integrarse en tu empresa y trabajar 24/7 sin supervisión constante.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Cpu className="w-5 h-5 text-blue-400" />,
                  title: "Cognición Avanzada",
                  desc: "Razonamiento multi-paso para resolver problemas complejos y tomar decisiones de negocio."
                },
                {
                  icon: <Layers className="w-5 h-5 text-purple-400" />,
                  title: "Integración de Herramientas",
                  desc: "Conectamos los agentes a tu Google Workspace, Notion, Slack, y cualquier API REST."
                },
                {
                  icon: <TerminalSquare className="w-5 h-5 text-emerald-400" />,
                  title: "Ejecución Autónoma",
                  desc: "Flujos de trabajo desatendidos. Tú defines el objetivo, el agente encuentra el camino."
                }
              ].map((feature, i) => (
                <div key={i} className="glass p-6 rounded-xl border-border/50 hover:border-primary/30 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-background/50 border border-border flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background/80">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="al-go-sm" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#f472b6"></stop><stop offset="50%" stopColor="#a78bfa"></stop><stop offset="100%" stopColor="#22d3ee"></stop></linearGradient><filter id="al-core-sm"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.9"></feDropShadow></filter></defs><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go-sm)" strokeWidth="2" fill="none" opacity="0.45"></ellipse><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go-sm)" strokeWidth="2" fill="none" opacity="0.45" transform="rotate(60 36 36)"></ellipse><ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go-sm)" strokeWidth="2" fill="none" opacity="0.45" transform="rotate(120 36 36)"></ellipse><circle cx="36" cy="36" r="5.5" fill="url(#al-go-sm)" filter="url(#al-core-sm)"></circle></svg>
            <span className="font-semibold text-lg">Praxia Labs</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Praxia Labs. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm font-medium">
            <a href="mailto:jmaria.romero@praxialabs.com" className="text-muted-foreground hover:text-foreground transition-colors">
              jmaria.romero@praxialabs.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
