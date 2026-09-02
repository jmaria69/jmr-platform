import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductEn } from "@/content/products-en";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "Core OPS — IT operations in one dashboard",
  description:
    "Network, ERP, inventory, and operations in a single dashboard with real-time alerts, instead of six tools that don't talk to each other.",
  alternates: {
    canonical: "/en/core-ops",
    languages: { es: "/core-ops", "x-default": "/core-ops" },
  },
};

export default function CoreOpsPageEn() {
  const product = getProductEn("core-ops");
  if (!product) notFound();
  return (
    <div lang="en">
      <ProductLanding product={product} lang="en" />
    </div>
  );
}
