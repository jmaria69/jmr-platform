import { CRMContact } from "@/types";

// ─────────────────────────────────────────────────────────────
// Sin datos ficticios.
// Antes este fichero exportaba contactos CRM inventados, un generador
// de visitantes aleatorios y unas dashboardStats hardcodeadas (8.950 €,
// 52.400 €, etc.). Todo eso mostraba métricas falsas en el panel, así que
// se ha eliminado. El CRM se puebla solo con contactos reales desde la BD;
// si está vacía, se muestra vacío.
// ─────────────────────────────────────────────────────────────

export const crmContacts: CRMContact[] = [];
