import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl glass border-gradient p-10 max-w-md">
        <p className="text-7xl font-bold text-gradient mb-4">404</p>
        <h2 className="text-xl font-bold mb-2">Página no encontrada</h2>
        <p className="text-sm text-muted-foreground mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Button>
          </Link>
          <Link href="/proyectos">
            <Button variant="outline" className="gap-2 w-full glass">
              <ArrowLeft className="h-4 w-4" />
              Ver proyectos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
