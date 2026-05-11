"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // TODO: Report to error monitoring service (Sentry, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl glass border-gradient p-10 max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Ha ocurrido un error inesperado. Puedes intentar recargar la página.
        </p>
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
