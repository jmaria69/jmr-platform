import Link from "next/link";
import { Globe, Link as LinkIcon, Mail } from "lucide-react";

function PraxiaLabLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fl-go" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="fl-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="1" /></filter>
        <filter id="fl-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f472b6" floodOpacity="1" /></filter>
        <filter id="fl-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a78bfa" floodOpacity="1" /></filter>
        <filter id="fl-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" floodOpacity="1" /></filter>
        <filter id="fl-core"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.9" /></filter>
      </defs>
      {/* Orbit rings */}
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#fl-go)" strokeWidth="1.3" fill="none" opacity="0.45" />
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#fl-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#fl-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)" />
      {/* Nucleus */}
      <circle cx="36" cy="36" r="5.5" fill="url(#fl-go)" filter="url(#fl-core)" />
      <circle cx="36" cy="36" r="2.5" fill="white" opacity="0.95" />
      {/* Orbit 1 — cyan */}
      <circle fill="#22d3ee" filter="url(#fl-fc)">
        <animate attributeName="cx" dur="5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
        <animate attributeName="cy" dur="5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
        <animate attributeName="r" dur="2.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#38bdf8" filter="url(#fl-fc)" opacity="0.85">
        <animate attributeName="cx" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
        <animate attributeName="cy" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
        <animate attributeName="r" dur="1.7s" begin="-0.9s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      {/* Orbit 2 — pink */}
      <circle fill="#f472b6" filter="url(#fl-fp)">
        <animate attributeName="cx" dur="7s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
        <animate attributeName="cy" dur="7s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
        <animate attributeName="r" dur="2.5s" begin="-0.5s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#e879f9" filter="url(#fl-fp)" opacity="0.85">
        <animate attributeName="cx" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
        <animate attributeName="cy" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
        <animate attributeName="r" dur="1.9s" begin="-1.2s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      {/* Orbit 3 — violet + emerald */}
      <circle fill="#a78bfa" filter="url(#fl-fv)">
        <animate attributeName="cx" dur="6s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
        <animate attributeName="cy" dur="6s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
        <animate attributeName="r" dur="2.3s" begin="-1.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#34d399" filter="url(#fl-fg)" opacity="0.9">
        <animate attributeName="cx" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
        <animate attributeName="cy" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
        <animate attributeName="r" dur="2.0s" begin="-0.3s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[oklch(0.07_0.005_270)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <PraxiaLabLogo size={28} />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
                  Praxia<span className="text-sky-400">Labs</span>
                </span>
                <span className="text-[8px] font-semibold text-white/30 uppercase tracking-[0.2em]">
                  AI Agents Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Soluciones tecnológicas inteligentes para empresas que quieren crecer.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white/80">Navegación</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Inicio</Link></li>
              <li><Link href="/proyectos" className="hover:text-foreground transition-colors">Proyectos</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white/80">Proyectos</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/proyectos/admin-app" className="hover:text-foreground transition-colors">AdminApp Maestro</Link></li>
              <li><Link href="/proyectos/crm-it" className="hover:text-foreground transition-colors">Core OPS</Link></li>
              <li><Link href="/proyectos/olga-ai" className="hover:text-foreground transition-colors">OLGA.ai</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white/80">Contacto</h4>
            <div className="flex gap-2.5">
              {[
                { icon: Globe, href: "https://github.com", label: "Web" },
                { icon: LinkIcon, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:jmaria.romero79@gmail.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl glass text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PraxiaLabs. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
