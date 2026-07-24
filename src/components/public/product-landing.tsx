import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/content/products";

export function ProductLanding({
  product,
  children,
}: {
  product: Product;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ background: `${product.color}18`, borderColor: `${product.color}40` }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: product.color }} />
            <span className="text-sm" style={{ color: product.color }}>{product.badge}</span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl leading-[1.1] text-gray-900 dark:text-white">
            {product.titular}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.bajada}
          </p>

          {product.fuentes.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {product.fuentes.map((f) => (
                <li key={f.url}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-gray-500 hover:text-gray-400 underline underline-offset-2"
                  >
                    Fuente: {f.titulo}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={product.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
          >
            {product.ctaTexto} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-gray-900 dark:text-white mb-8">
            Por qué esto es un problema hoy
          </h2>
          <div className="space-y-4">
            {product.dolores.map((d) => (
              <div
                key={d.texto}
                className="rounded-xl border border-white/8 surface-card p-5"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{d.texto}</p>
                {d.fuente && (
                  <a
                    href={d.fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[11px] text-gray-500 hover:text-gray-400 underline underline-offset-2"
                  >
                    Fuente: {d.fuente.titulo}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-xl p-5 border"
            style={{ background: `${product.color}10`, borderColor: `${product.color}30` }}
          >
            <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: product.color }}>
              Qué hace {product.nombre}
            </p>
            <p className="text-gray-900 dark:text-white font-semibold leading-relaxed">
              {product.promesa}
            </p>
          </div>
        </div>
      </section>

      {children}

      <section className="py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl text-gray-900 dark:text-white">
            Hablamos 15 minutos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sin presentación comercial. Me cuentas cómo lo lleváis hoy y te digo si esto os sirve.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
          >
            Reservar una llamada <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
