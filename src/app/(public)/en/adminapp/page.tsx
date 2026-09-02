import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductEn } from "@/content/products-en";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "AdminApp Maestro — For property management firms",
  description:
    "14.3% of homes in Spain carry unpaid debt with their community, averaging €1,847 each. AdminApp claims, reconciles, and documents it for you.",
  alternates: {
    canonical: "/en/adminapp",
    languages: { es: "/adminapp", "x-default": "/adminapp" },
  },
};

export default function AdminAppPageEn() {
  const product = getProductEn("adminapp");
  if (!product) notFound();
  return (
    <div lang="en">
      <ProductLanding product={product} lang="en" />
    </div>
  );
}
