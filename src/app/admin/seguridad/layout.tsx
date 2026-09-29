import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Seguridad",
  description: "Monitoriza en tiempo real los ataques bloqueados, configura alertas por email y revisa el mapa de amenazas.",
};

export default function SeguridadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
