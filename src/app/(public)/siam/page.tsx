import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";
import { Nis2Calculator } from "@/components/public/nis2-calculator";

export const metadata: Metadata = {
  title: "SIAM — SOC virtual para pymes | Praxia Labs",
  description:
    "El 70% de los ciberataques en España caen sobre pymes. SIAM te da visibilidad de lo que pasa en tu red y la capacidad de notificarlo dentro del plazo que exige NIS2.",
};

export default function SiamPage() {
  const product = getProduct("siam");
  if (!product) notFound();

  return (
    <ProductLanding product={product}>
      <section className="py-16 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-gray-900 dark:text-white mb-3">
            ¿Te aplica la directiva?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            NIS2 no distingue por lo preparado que estés, sino por tu sector y tu tamaño.
            Compruébalo aquí.
          </p>
          <Nis2Calculator />
        </div>
      </section>
    </ProductLanding>
  );
}
