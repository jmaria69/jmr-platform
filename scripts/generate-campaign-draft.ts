/**
 * Genera un borrador de campaña con IA local: Ollama redacta copy/guion a partir de un brief de
 * investigación (preparado a mano o con ayuda de Claude Code + WebSearch), ComfyUI genera el
 * vídeo con los checkpoints locales instalados, el vídeo se sube a Vercel Blob y el borrador
 * queda insertado en la tabla `campaigns` con status "borrador" para revisión manual en
 * /admin/campanas. Nunca publica ni activa nada por sí solo.
 *
 * Requisitos previos:
 *   - Ollama corriendo en localhost:11434 con el modelo indicado ya descargado.
 *   - ComfyUI corriendo en 127.0.0.1:8188 (arrancar a mano: cd ~/CORE_OPS_VIDEO/ComfyUI && python main.py).
 *   - BLOB_READ_WRITE_TOKEN y DATABASE_URL en .env.local.
 *
 * Uso:
 *   node --require dotenv/config scripts/generate-campaign-draft.ts --input brief.md --slug mi-campana [--model qwen3.6:latest]
 */

import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const COMFY_URL = "http://127.0.0.1:8188";
const DEFAULT_MODEL = "qwen3.6:latest";

interface DraftContent {
  name: string;
  description: string;
  script: string;
}

function parseArgs(): { input: string; slug: string; model: string } {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const input = get("--input");
  const slug = get("--slug");
  if (!input || !slug) {
    console.error("Uso: --input <brief.md> --slug <slug-campana> [--model <modelo-ollama>]");
    process.exit(1);
  }
  return { input, slug, model: get("--model") || DEFAULT_MODEL };
}

async function draftWithOllama(model: string, research: string): Promise<DraftContent> {
  const prompt = `Eres un redactor de campañas B2B para Praxia Labs (automatización con IA para empresas).
A partir de esta investigación, devuelve SOLO un JSON válido (sin markdown) con:
- "name": nombre corto de campaña
- "description": 2-3 frases del ángulo/mensaje principal
- "script": guion corto (4-6 planos) para un vídeo vertical de 15-20s, cada plano en una línea

Investigación:
${research}`;

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false, format: "json" }),
  });
  if (!res.ok) throw new Error(`Ollama respondió ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.response) as DraftContent;
}

// Workflow mínimo de texto-a-vídeo para el checkpoint Wan2.2 ya instalado en ComfyUI.
function buildComfyWorkflow(scriptText: string) {
  const prompt = scriptText.replace(/\n+/g, ". ").slice(0, 800);
  return {
    "3": {
      class_type: "KSampler",
      inputs: {
        seed: Math.floor(Math.random() * 1e9),
        steps: 20,
        cfg: 6,
        sampler_name: "euler",
        scheduler: "normal",
        denoise: 1,
        model: ["4", 0],
        positive: ["6", 0],
        negative: ["7", 0],
        latent_image: ["5", 0],
      },
    },
    "4": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: "wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors" } },
    "5": { class_type: "EmptyLatentVideo", inputs: { width: 720, height: 1280, length: 49, batch_size: 1 } },
    "6": { class_type: "CLIPTextEncode", inputs: { text: prompt, clip: ["4", 1] } },
    "7": { class_type: "CLIPTextEncode", inputs: { text: "baja calidad, borroso, texto, marca de agua", clip: ["4", 1] } },
    "8": { class_type: "VAEDecode", inputs: { samples: ["3", 0], vae: ["4", 2] } },
    "9": { class_type: "SaveVideo", inputs: { images: ["8", 0], filename_prefix: "campaign_draft" } },
  };
}

async function generateVideoWithComfy(scriptText: string): Promise<Buffer> {
  const workflow = buildComfyWorkflow(scriptText);
  const submit = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow }),
  });
  if (!submit.ok) throw new Error(`ComfyUI rechazó el workflow: ${submit.status} — ¿está arrancado en 127.0.0.1:8188?`);
  const { prompt_id } = await submit.json();

  // Sondeo del historial hasta que el job termine (sin timeout: la generación de vídeo puede tardar minutos)
  let outputFilename: string | null = null;
  while (!outputFilename) {
    await new Promise((r) => setTimeout(r, 3000));
    const hist = await fetch(`${COMFY_URL}/history/${prompt_id}`);
    const json = await hist.json();
    const entry = json[prompt_id];
    if (!entry) continue;
    const outputs = entry.outputs?.["9"]?.videos ?? entry.outputs?.["9"]?.gifs;
    if (outputs?.[0]?.filename) outputFilename = outputs[0].filename;
  }

  const view = await fetch(`${COMFY_URL}/view?filename=${encodeURIComponent(outputFilename)}&type=output`);
  if (!view.ok) throw new Error("No se pudo descargar el vídeo generado de ComfyUI");
  return Buffer.from(await view.arrayBuffer());
}

async function main() {
  const { input, slug, model } = parseArgs();
  const research = readFileSync(input, "utf-8");

  console.log(`→ Redactando propuesta con Ollama (${model})...`);
  const draft = await draftWithOllama(model, research);
  console.log(`  Nombre: ${draft.name}`);

  console.log("→ Generando vídeo con ComfyUI local (puede tardar varios minutos)...");
  const videoBuffer = await generateVideoWithComfy(draft.script);

  console.log("→ Subiendo vídeo a Vercel Blob...");
  const blob = await put(`campaigns/${slug}-draft-${Date.now()}.mp4`, videoBuffer, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    access: "public",
    contentType: "video/mp4",
    addRandomSuffix: false,
  });

  console.log("→ Guardando borrador en la base de datos...");
  const prisma = new PrismaClient();
  const campaign = await prisma.campaign.create({
    data: {
      slug,
      name: draft.name,
      description: draft.description,
      channel: "otro",
      status: "borrador",
      targetUrl: "https://praxialabs.com",
      researchNotes: research,
      script: draft.script,
      videoUrl: blob.url,
    },
  });
  await prisma.$disconnect();

  console.log(`\nBorrador creado: ${campaign.id}`);
  console.log("Revísalo en /admin/campanas antes de aprobarlo.");
}

main().catch((err) => {
  console.error("Error generando el borrador:", err);
  process.exit(1);
});
