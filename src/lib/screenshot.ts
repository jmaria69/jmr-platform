import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export interface ScreenshotResult {
  buffer: Buffer;
  contentType: "image/png";
}

const VIEWPORT = { width: 1280, height: 800 };
const NAV_TIMEOUT_MS = 8000;

/**
 * Captura la home de un proyecto en PNG. Lanza y cierra su propio Chromium
 * por invocación (sin pool) — el volumen de uso (botón manual en admin) no
 * lo justifica, y evita mantener estado de navegador entre invocaciones
 * serverless.
 */
export async function captureProjectScreenshot(url: string): Promise<ScreenshotResult> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    defaultViewport: VIEWPORT,
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT_MS });
    const buffer = (await page.screenshot({ type: "png" })) as Buffer;
    return { buffer, contentType: "image/png" };
  } finally {
    await browser.close();
  }
}
