"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AgenticLabLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <filter id="al-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#818cf8" floodOpacity="0.7" />
        </filter>
      </defs>
      {/* Outer hex ring */}
      <polygon
        points="20,2 35,11 35,29 20,38 5,29 5,11"
        stroke="url(#al-grad)" strokeWidth="1.5" fill="none" opacity="0.4"
      />
      {/* Inner hex */}
      <polygon
        points="20,8 31,14.5 31,25.5 20,32 9,25.5 9,14.5"
        stroke="url(#al-grad)" strokeWidth="1.5" fill="none" filter="url(#al-glow)"
      />
      {/* Center node */}
      <circle cx="20" cy="20" r="3" fill="url(#al-grad)" filter="url(#al-glow)" />
      {/* Spokes */}
      <line x1="20" y1="20" x2="20" y2="8"  stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      <line x1="20" y1="20" x2="31" y2="14.5" stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      <line x1="20" y1="20" x2="31" y2="25.5" stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      <line x1="20" y1="20" x2="20" y2="32"  stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      <line x1="20" y1="20" x2="9"  y2="25.5" stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      <line x1="20" y1="20" x2="9"  y2="14.5" stroke="url(#al-grad)" strokeWidth="1" opacity="0.8" />
      {/* Corner nodes */}
      <circle cx="20"  cy="8"    r="1.8" fill="#a78bfa" />
      <circle cx="31"  cy="14.5" r="1.8" fill="#818cf8" />
      <circle cx="31"  cy="25.5" r="1.8" fill="#38bdf8" />
      <circle cx="20"  cy="32"   r="1.8" fill="#38bdf8" />
      <circle cx="9"   cy="25.5" r="1.8" fill="#818cf8" />
      <circle cx="9"   cy="14.5" r="1.8" fill="#a78bfa" />
    </svg>
  );
}

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
            <AgenticLabLogo size={36} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
              Agentic<span className="text-sky-400">Lab</span>
            </span>
            <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em]">
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
          <Link href="/admin/dashboard" className="ml-3">
            <button className="inline-flex items-center gap-2 rounded-xl shimmer-btn px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105">
              <Rocket className="h-4 w-4" />
              Admin
            </button>
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
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
              <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                <button className="w-full mt-4 shimmer-btn rounded-xl px-4 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Panel Admin
                </button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
