import Link from "next/link";
import { Globe, Link as LinkIcon, Mail } from "lucide-react";
import { PraxiaLabLogo } from "@/components/praxia-lab-logo";
import { ResponsivePraxiaLabLogo } from "@/components/public/responsive-logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[oklch(0.07_0.005_270)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ResponsivePraxiaLabLogo />
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
