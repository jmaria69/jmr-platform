import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "AI automation plans for businesses. From €950/month. No minimum commitment.",
  alternates: {
    canonical: "/en/pricing",
    languages: { es: "/precios", "x-default": "/precios" },
  },
};

export default function PricingLayoutEn({ children }: { children: React.ReactNode }) {
  return children;
}
