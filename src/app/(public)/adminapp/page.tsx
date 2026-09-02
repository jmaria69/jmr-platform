import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "AdminApp Maestro — Para administradores de fincas",
  description:
    "El 14,3% de las viviendas arrastra deuda con su comunidad, con una media de 1.847 € cada una. AdminApp reclama, concilia y documenta por ti.",
  alternates: {
    canonical: "/adminapp",
    languages: { en: "/en/adminapp", "x-default": "/adminapp" },
  },
};

export default function AdminAppPage() {
  const product = getProduct("adminapp");
  if (!product) notFound();
  return <ProductLanding product={product} />;
}
