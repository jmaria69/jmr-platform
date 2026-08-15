/**
 * Sincroniza una campaña genérica (de este proyecto o de cualquier otro: SIAM, CRM IT,
 * AdminApp, GWS...) con la tabla `campaigns` que alimenta /admin/campanas. Es la contraparte
 * genérica de scripts/generate-campaign-draft.ts (que es específico del pipeline Ollama+ComfyUI):
 * este script no genera contenido, solo INSERTA lo que ya le pasas en un fichero JSON.
 *
 * Como con generate-campaign-draft.ts, la campaña nace SIEMPRE en estado "borrador" — nunca se
 * publica ni activa sola. Hay que aprobarla a mano en /admin/campanas.
 *
 * Es idempotente por slug:
 *   - Si el slug no existe → crea el borrador.
 *   - Si existe y sigue en "borrador" → actualiza su contenido (re-sincronización segura).
 *   - Si existe y YA fue revisada (activa/pausada/finalizada) → rehúsa sobrescribir y avisa,
 *     para no pisar una decisión humana ya tomada. Usa --force para forzarlo de todos modos.
 *
 * Formato del JSON de entrada (todos los campos excepto slug/name/targetUrl son opcionales):
 *   {
 *     "slug": "siem-security-launch",
 *     "name": "Lanzamiento SIEM Security",
 *     "channel": "linkedin",
 *     "targetUrl": "https://siem.praxialabs.com",
 *     "description": "Frase corta que se ve en la tarjeta colapsada del admin.",
 *     "researchNotes": "Contexto/brief detrás de la campaña (se ve en 'Ver propuesta').",
 *     "script": "El copy/guion completo — en este caso, los posts de LinkedIn.",
 *     "videoUrl": null
 *   }
 *
 * Uso:
 *   node --require dotenv/config scripts/sync-campaign.ts --input ruta/a/campaign.json [--force]
 */

import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

interface CampaignInput {
  slug: string;
  name: string;
  channel?: string;
  targetUrl: string;
  description?: string;
  researchNotes?: string;
  script?: string;
  videoUrl?: string | null;
}

const REVIEWED_STATUSES = new Set(["activa", "pausada", "finalizada"]);

function parseArgs(): { input: string; force: boolean } {
  const args = process.argv.slice(2);
  const i = args.indexOf("--input");
  const input = i >= 0 ? args[i + 1] : undefined;
  if (!input) {
    console.error("Uso: --input <campaign.json> [--force]");
    process.exit(1);
  }
  return { input, force: args.includes("--force") };
}

function loadCampaign(path: string): CampaignInput {
  const raw = JSON.parse(readFileSync(path, "utf-8"));
  for (const field of ["slug", "name", "targetUrl"]) {
    if (!raw[field]) throw new Error(`Falta el campo obligatorio "${field}" en ${path}`);
  }
  if (!/^[a-z0-9-]{2,40}$/.test(raw.slug)) {
    throw new Error(`El slug "${raw.slug}" solo admite minúsculas, números y guiones (2-40 caracteres)`);
  }
  try {
    new URL(raw.targetUrl);
  } catch {
    throw new Error(`targetUrl "${raw.targetUrl}" no es una URL válida`);
  }
  return raw as CampaignInput;
}

async function main() {
  const { input, force } = parseArgs();
  const campaign = loadCampaign(input);

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.campaign.findUnique({ where: { slug: campaign.slug } });

    if (existing && REVIEWED_STATUSES.has(existing.status) && !force) {
      console.error(
        `✗ La campaña "${campaign.slug}" ya existe y está en estado "${existing.status}" ` +
          `(ya fue revisada). No se sobrescribe para no pisar una decisión humana.\n` +
          `  Usa --force si de verdad quieres reemplazar su contenido.`
      );
      process.exit(1);
    }

    const data = {
      name: campaign.name,
      description: campaign.description || "",
      channel: campaign.channel || "linkedin",
      targetUrl: campaign.targetUrl,
      researchNotes: campaign.researchNotes ?? null,
      script: campaign.script ?? null,
      videoUrl: campaign.videoUrl ?? null,
    };

    if (existing) {
      await prisma.campaign.update({ where: { id: existing.id }, data });
      console.log(`✓ Borrador "${campaign.slug}" actualizado (id ${existing.id}).`);
    } else {
      const row = await prisma.campaign.create({ data: { slug: campaign.slug, status: "borrador", ...data } });
      console.log(`✓ Borrador "${campaign.slug}" creado (id ${row.id}).`);
    }
    console.log(`  Enlace corto: https://praxialabs.com/c/${campaign.slug}`);
    console.log(`  Revísalo y apruébalo en /admin/campanas.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Error sincronizando la campaña:", err.message || err);
  process.exit(1);
});
