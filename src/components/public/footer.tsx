import Link from "next/link";
import { Globe, Link as LinkIcon, Mail } from "lucide-react";

function AgenticLabLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-grad-f" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" stroke="url(#al-grad-f)" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <polygon points="20,8 31,14.5 31,25.5 20,32 9,25.5 9,14.5" stroke="url(#al-grad-f)" strokeWidth="1.5" fill="none"/>
      <circle cx="20" cy="20" r="3" fill="url(#al-grad-f)" />
      <line x1="20" y1="20" x2="20" y2="8"   stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="20" x2="31" y2="14.5" stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="20" x2="31" y2="25.5" stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="20" x2="20" y2="32"   stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="20" x2="9"  y2="25.5" stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <line x1="20" y1="20" x2="9"  y2="14.5" stroke="url(#al-grad-f)" strokeWidth="1" opacity="0.8"/>
      <circle cx="20"  cy="8"    r="1.8" fill="#a78bfa"/>
      <circle cx="31"  cy="14.5" r="1.8" fill="#818cf8"/>
      <circle cx="31"  cy="25.5" r="1.8" fill="#38bdf8"/>
      <circle cx="20"  cy="32"   r="1.8" fill="#38bdf8"/>
      <circle cx="9"   cy="25.5" r="1.8" fill="#818cf8"/>
      <circle cx="9"   cy="14.5" r="1.8" fill="#a78bfa"/>
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
              <AgenticLabLogo size={28} />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
                  Agentic<span className="text-sky-400">Lab</span>
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
                { icon: Mail, href: "mailto:contacto@agenticlab.dev", label: "Email" },
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
          &copy; {new Date().getFullYear()} AgenticLab. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
