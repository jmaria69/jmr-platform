"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AgenticLabLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-go" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="al-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="1"/></filter>
        <filter id="al-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f472b6" floodOpacity="1"/></filter>
        <filter id="al-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a78bfa" floodOpacity="1"/></filter>
        <filter id="al-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" floodOpacity="1"/></filter>
        <filter id="al-core"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.9"/></filter>
        <path id="al-base" d="M34,0 A34,11 0 1,1 33.999,0.001 Z"/>
      </defs>
      {/* Orbit rings */}
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45"/>
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)"/>
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)"/>
      {/* Nucleus */}
      <circle cx="36" cy="36" r="5.5" fill="url(#al-go)" filter="url(#al-core)"/>
      <circle cx="36" cy="36" r="2.5" fill="white" opacity="0.95"/>
      {/* Orbit 1 — cyan */}
      <g transform="translate(36,36) rotate(0)">
        <circle r="3.2" fill="#22d3ee" filter="url(#al-fc)">
          <animateMotion dur="3.5s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
        <circle r="2.2" fill="#38bdf8" filter="url(#al-fc)" opacity="0.85">
          <animateMotion dur="3.5s" begin="-1.75s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
      </g>
      {/* Orbit 2 — pink */}
      <g transform="translate(36,36) rotate(60)">
        <circle r="3.2" fill="#f472b6" filter="url(#al-fp)">
          <animateMotion dur="5s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
        <circle r="2.2" fill="#e879f9" filter="url(#al-fp)" opacity="0.85">
          <animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
      </g>
      {/* Orbit 3 — violet + emerald */}
      <g transform="translate(36,36) rotate(120)">
        <circle r="3.2" fill="#a78bfa" filter="url(#al-fv)">
          <animateMotion dur="4.2s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
        <circle r="2.2" fill="#34d399" filter="url(#al-fg)" opacity="0.9">
          <animateMotion dur="4.2s" begin="-2.1s" repeatCount="indefinite" calcMode="linear"><mpath href="#al-base"/></animateMotion>
        </circle>
      </g>
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
