// Los agentes guardan las fechas con datetime.utcnow().isoformat(), que produce
// "2026-09-18T12:00:00.123456": UTC pero sin marca de zona. JavaScript interpreta
// esa forma como hora *local*, así que un mensaje de las 14:00 en Madrid se
// mostraba a las 12:00. Se le añade la Z que falta antes de convertir.
//
// Si algún agente se actualiza y empieza a emitir fechas con zona ("+00:00" o
// "Z"), se respetan tal cual.
const CON_ZONA = /(Z|[+-]\d{2}:?\d{2})$/;

export function fechaAgente(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const fecha = new Date(CON_ZONA.test(iso) ? iso : `${iso}Z`);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

/** Milisegundos para ordenar; las fechas ausentes o inválidas van al final. */
export function msFechaAgente(iso: string | null | undefined): number {
  return fechaAgente(iso)?.getTime() ?? -Infinity;
}

export function formatearFechaAgente(iso: string | null | undefined): string {
  return fechaAgente(iso)?.toLocaleString("es-ES") ?? "";
}
