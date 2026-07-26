"use client";

import { useEffect, useRef } from "react";

/**
 * Registra una vista del proyecto al montar. Se ejecuta en el cliente (no en
 * prefetch), así que no infla el conteo con prebúsquedas de Next. Fire-and-forget:
 * si el beacon falla, la página no se entera.
 */
export function ProjectViewTracker({ projectId }: { projectId: string }) {
  const enviado = useRef(false);

  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    fetch(`/api/projects/${encodeURIComponent(projectId)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [projectId]);

  return null;
}
