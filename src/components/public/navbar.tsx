"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { PraxiaLabLogo } from "@/components/praxia-lab-logo";
import { ResponsivePraxiaLabLogo } from "@/components/public/responsive-logo";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { isEnglishPath, counterpartPath } from "@/lib/i18n-routes";

const LINKS_ES = [
  { href: "/", label: "Inicio" },
  { href: "/siam", label: "SIAM" },
  { href: "/core-ops", label: "Core OPS" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/precios", label: "Precios" },
];

const LINKS_EN = [
  { href: "/en", label: "Home" },
  { href: "/en/siam", label: "SIAM" },
  { href: "/en/core-ops", label: "Core OPS" },
  { href: "/en/lab", label: "Lab" },
  { href: "/en/pricing", label: "Pricing" },
];

function LangSwitch({ pathname, className = "" }: { pathname: string; className?: string }) {
  const isEn = isEnglishPath(pathname);
  const target = counterpartPath(pathname);
  return (
    <Link
      href={target}
      className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-white/5 ${className}`}
      hrefLang={isEn ? "es" : "en"}
    >
      {isEn ? "ES" : "EN"}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isEn = isEnglishPath(pathname);
  const links = isEn ? LINKS_EN : LINKS_ES;
  const homeHref = isEn ? "/en" : "/";
  const contactHref = isEn ? "/contact" : "/contacto";
  const ctaLabel = isEn ? "Book a demo" : "Reservar demo";

  return (
    <header className="sticky top-0 z-50 w-full glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2 group">
          <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
            <ResponsivePraxiaLabLogo lg={44} md={38} sm={32} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="navbar-logo-name text-base font-black tracking-tight">
              PraxiaLabs
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Agents Studio
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <LangSwitch pathname={pathname} />
          <ThemeToggle />
          <Link href={contactHref} className="ml-1">
            <button className="inline-flex items-center gap-2 rounded-xl shimmer-btn px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105">
              {ctaLabel}
            </button>
          </Link>
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 md:hidden">
          <LangSwitch pathname={pathname} />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 glass-strong border-l-white/5">
            <nav className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link href={contactHref} onClick={() => setOpen(false)}>
                <button className="w-full mt-4 shimmer-btn rounded-xl px-4 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2">
                  {ctaLabel}
                </button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
