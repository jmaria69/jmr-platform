/** Productos con landing propia: no aparecen en el laboratorio. */
export const CON_LANDING: ReadonlySet<string> = new Set(["siam", "crm-it", "admin-app"]);

/** Deja fuera del laboratorio los productos que ya tienen su propia landing. */
export function filtrarLaboratorio<T extends { id: string }>(proyectos: T[]): T[] {
  return proyectos.filter((p) => !CON_LANDING.has(p.id));
}
