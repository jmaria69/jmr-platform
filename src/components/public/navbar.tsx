"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { PraxiaLabLogo } from "@/components/praxia-lab-logo";

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
            <PraxiaLabLogo size={36} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-transparent">
              Praxia<span className="text-sky-400">Lab</span>
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
