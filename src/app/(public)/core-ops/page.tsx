import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "Core OPS — Operaciones IT en un panel | Praxia Labs",
  description:
    "Red, ERP, inventario y operaciones en un panel único con alertas en tiempo real, en lugar de seis herramientas que no se hablan.",
};

export default function CoreOpsPage() {
  const product = getProduct("core-ops");
  if (!product) notFound();
  return <ProductLanding product={product} />;
}
