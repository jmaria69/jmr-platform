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

  // think:false es obligatorio con modelos de razonamiento (qwen3.x): si no, Ollama vuelca todo el
  // JSON en el campo "thinking" y deja "response" vacío, rompiendo el JSON.parse de abajo.
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false, format: "json", think: false }),
  });
  if (!res.ok) throw new Error(`Ollama respondió ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.response) as DraftContent;
}

// Workflow de texto-a-vídeo para los checkpoints Wan2.2 14B (MoE: experto "high noise" para el
// primer tramo de pasos, experto "low noise" para el resto) ya instalados en ComfyUI, acelerado
// con las LoRAs lightx2v de 4 pasos. Wan2.2 son modelos de difusión sueltos (no un checkpoint
// combinado), por eso se cargan con UNETLoader/CLIPLoader/VAELoader en vez de
// CheckpointLoaderSimple — y no existe un nodo "EmptyLatentVideo" genérico para Wan: el latente
// vacío con la forma correcta lo produce WanImageToVideo cuando no se le pasa start_image.
function buildComfyWorkflow(scriptText: string) {
  const prompt = scriptText.replace(/\n+/g, ". ").slice(0, 800);
  const seed = Math.floor(Math.random() * 1e9);
  return {
    "10": { class_type: "UNETLoader", inputs: { unet_name: "wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors", weight_dtype: "default" } },
    "11": { class_type: "LoraLoaderModelOnly", inputs: { model: ["10", 0], lora_name: "wan2.2_t2v_lightx2v_4steps_lora_v1.1_high_noise.safetensors", strength_model: 1.0 } },
    "12": { class_type: "UNETLoader", inputs: { unet_name: "wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors", weight_dtype: "default" } },
    "13": { class_type: "LoraLoaderModelOnly", inputs: { model: ["12", 0], lora_name: "wan2.2_t2v_lightx2v_4steps_lora_v1.1_low_noise.safetensors", strength_model: 1.0 } },
    "14": { class_type: "CLIPLoader", inputs: { clip_name: "umt5_xxl_fp8_e4m3fn_scaled.safetensors", type: "wan" } },
    // Los checkpoints 14B MoE (high/low noise) usan el VAE original de Wan2.1, NO wan2.2_vae.safetensors
    // (ese es solo para el modelo TI2V-5B, con una compresión de canales distinta e incompatible).
    "15": { class_type: "VAELoader", inputs: { vae_name: "wan_2.1_vae.safetensors" } },
    "16": { class_type: "CLIPTextEncode", inputs: { text: prompt, clip: ["14", 0] } },
    "17": { class_type: "CLIPTextEncode", inputs: { text: "baja calidad, borroso, texto, marca de agua, estático", clip: ["14", 0] } },
    "18": { class_type: "WanImageToVideo", inputs: { positive: ["16", 0], negative: ["17", 0], vae: ["15", 0], width: 480, height: 832, length: 81, batch_size: 1 } },
    "19": {
      class_type: "KSamplerAdvanced",
      inputs: {
        model: ["11", 0], add_noise: "enable", noise_seed: seed, steps: 4, cfg: 1.0,
        sampler_name: "euler", scheduler: "simple",
        positive: ["18", 0], negative: ["18", 1], latent_image: ["18", 2],
        start_at_step: 0, end_at_step: 2, return_with_leftover_noise: "enable",
      },
    },
    "20": {
      class_type: "KSamplerAdvanced",
      inputs: {
        model: ["13", 0], add_noise: "disable", noise_seed: seed, steps: 4, cfg: 1.0,
        sampler_name: "euler", scheduler: "simple",
        positive: ["18", 0], negative: ["18", 1], latent_image: ["19", 0],
        start_at_step: 2, end_at_step: 10000, return_with_leftover_noise: "disable",
      },
    },
    "21": { class_type: "VAEDecode", inputs: { samples: ["20", 0], vae: ["15", 0] } },
    "22": { class_type: "CreateVideo", inputs: { images: ["21", 0], fps: 16 } },
    // SaveVideo.codec es un DynamicCombo: el nodo hace codec["codec"], no admite el string suelto "auto".
    "23": { class_type: "SaveVideo", inputs: { video: ["22", 0], filename_prefix: "campaign_draft", format: "mp4", codec: { codec: "auto" } } },
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
    if (entry.status?.status_str === "error") {
      throw new Error(`ComfyUI falló al ejecutar el workflow: ${JSON.stringify(entry.status.messages ?? entry.status)}`);
    }
    const outputs = entry.outputs?.["23"]?.videos ?? entry.outputs?.["23"]?.gifs;
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
