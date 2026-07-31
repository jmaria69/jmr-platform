import type { Metadata } from "next";
import { HomeConfigForm } from "@/components/admin/home-config-form";

export const metadata: Metadata = { title: "Apariencia de la Home" };

export default function AdminAparienciaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Apariencia de la Home</h2>
        <p className="text-muted-foreground">
          Colores, cursor-rayo, efectos, textos del hero y secciones visibles. Los cambios se guardan
          y se aplican en la portada (recarga la home tras guardar).
        </p>
      </div>
      <HomeConfigForm />
    </div>
  );
}
