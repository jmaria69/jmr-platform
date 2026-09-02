import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios",
  description: "Planes de automatización con IA para empresas. Desde 950€/mes. Sin permanencia mínima.",
  alternates: {
    canonical: "/precios",
    languages: { en: "/en/pricing", "x-default": "/precios" },
  },
};

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
