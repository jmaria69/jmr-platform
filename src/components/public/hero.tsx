"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCounter } from "@/hooks/use-counter";

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, ref } = useCounter(value, 2000);
  return (
    <div className="flex flex-col items-center" ref={ref}>
      <p className="text-3xl sm:text-4xl font-bold text-gradient">
        {count.toLocaleString("es")}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[oklch(0.5_0.2_275/20%)] blur-[120px] animate-glow-pulse" />
        {/* Secondary orbs */}
        <div className="absolute top-1/3 left-[15%] h-[300px] w-[300px] rounded-full bg-[oklch(0.6_0.15_195/15%)] blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-[10%] h-[250px] w-[250px] rounded-full bg-[oklch(0.6_0.18_155/12%)] blur-[80px] animate-float-delayed" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 10%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 10%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium border-gradient">
            <Sparkles className="h-4 w-4 text-[oklch(0.7_0.18_275)]" />
            Soluciones digitales a medida
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Tecnología que{" "}
            <span className="text-gradient">transforma</span>{" "}
            tu negocio
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Desarrollo de aplicaciones web, móviles y de escritorio con IA integrada.
            Desde CRMs inteligentes hasta automatización empresarial completa.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/proyectos">
              <button className="shimmer-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-[0.98]">
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 rounded-xl glass border-gradient hover:scale-105 transition-transform"
              >
                Contactar
              </Button>
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 glass rounded-2xl p-8 border-gradient">
            <AnimatedStat value={6} suffix="+" label="Proyectos activos" />
            <AnimatedStat value={900} suffix="+" label="Usuarios" />
            <AnimatedStat value={46} suffix="" label="Rating medio (4.6)" />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
