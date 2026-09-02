import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductEn } from "@/content/products-en";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "SIAM — Virtual SOC for SMBs",
  description:
    "70% of cyberattacks in Spain hit small and mid-sized businesses. SIAM gives you visibility into what's happening on your network and the ability to report it within the deadline upcoming regulation requires.",
  alternates: {
    canonical: "/en/siam",
    languages: { es: "/siam", "x-default": "/siam" },
  },
};

export default function SiamPageEn() {
  const product = getProductEn("siam");
  if (!product) notFound();

  return (
    <div lang="en">
      <ProductLanding product={product} lang="en">
        <section className="py-16 px-6 border-t border-purple-500/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl text-foreground mb-3">
              Does the directive apply to you?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              NIS2 doesn&apos;t care how prepared you are — it depends on your sector and size.
              We&apos;ll walk you through it on the call, or try our interactive exposure
              calculator (Spanish only).
            </p>
            <Link
              href="/siam#nis2-calculadora"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              Open the interactive calculator (Spanish) →
            </Link>
          </div>
        </section>
      </ProductLanding>
    </div>
  );
}
