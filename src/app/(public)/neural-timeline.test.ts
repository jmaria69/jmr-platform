import { describe, it, expect } from "vitest";
import { buildNeuralRowHtml, safeUrl } from "./neural-timeline";
import type { Project } from "@/types";

const baseProject: Project = {
  id: "olga-ai",
  name: "OLGA.ai",
  description: "Sistema multi-agente de operaciones.",
  longDescription: "",
  tech: ["Python"],
  status: "production",
  category: "ai",
  url: "https://olga.praxialabs.com",
  image: "/projects/gws.svg",
  color: "#8b5cf6",
};

describe("safeUrl", () => {
  it("deja pasar http(s)", () => {
    expect(safeUrl("https://example.com/a")).toBe("https://example.com/a");
  });

  it("deja pasar rutas relativas", () => {
    expect(safeUrl("/projects/gws.svg")).toBe("/projects/gws.svg");
  });

  it("bloquea esquemas peligrosos", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("");
  });

  it("devuelve vacío para null/undefined", () => {
    expect(safeUrl(null)).toBe("");
    expect(safeUrl(undefined)).toBe("");
  });
});

describe("buildNeuralRowHtml", () => {
  it("incluye un segmento SVG con id de gradiente único por proyecto", () => {
    const html = buildNeuralRowHtml(baseProject, 0);
    expect(html).toContain('<svg class="nseg"');
    expect(html).toContain(`id="neuralGrad-${baseProject.id}"`);
    expect(html).toContain(`url(#neuralGrad-${baseProject.id})`);
  });

  it("dos proyectos distintos generan ids de gradiente distintos (sin colisión)", () => {
    const htmlA = buildNeuralRowHtml(baseProject, 0);
    const htmlB = buildNeuralRowHtml({ ...baseProject, id: "siam" }, 1);
    expect(htmlA).toContain("neuralGrad-olga-ai");
    expect(htmlB).toContain("neuralGrad-siam");
    expect(htmlA).not.toContain("neuralGrad-siam");
  });

  it("escapa el nombre y la descripción", () => {
    const html = buildNeuralRowHtml({ ...baseProject, name: "<script>alert(1)</script>" }, 0);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it('usa la insignia con inicial cuando no hay imagen ni vídeo válidos', () => {
    const html = buildNeuralRowHtml({ ...baseProject, image: "" }, 0);
    expect(html).toContain("nimg-fb");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<video");
  });

  it("usa vídeo en autoplay en vez de imagen cuando el proyecto tiene videoUrl", () => {
    const html = buildNeuralRowHtml({ ...baseProject, videoUrl: "/videos/olga-ai.mp4" }, 0);
    expect(html).toContain('<video src="/videos/olga-ai.mp4"');
    expect(html).toContain("autoplay");
    expect(html).toContain("muted");
    expect(html).toContain("loop");
    expect(html).toContain(`poster="${baseProject.image}"`);
    expect(html).not.toContain("<img");
  });

  it("no genera vídeo si videoUrl es javascript:", () => {
    const html = buildNeuralRowHtml({ ...baseProject, videoUrl: "javascript:alert(1)" }, 0);
    expect(html).not.toContain("<video");
    expect(html).toContain("<img");
  });

  it('no genera enlace "Ver proyecto" si la URL es javascript:', () => {
    const html = buildNeuralRowHtml({ ...baseProject, url: "javascript:alert(1)" }, 0);
    expect(html).not.toContain("nlink");
  });

  it("envuelve el texto en ncard-body para que el CSS lo distinga de la imagen", () => {
    const html = buildNeuralRowHtml(baseProject, 0);
    expect(html).toContain('<div class="ncard-body">');
  });

  it("incluye una pill por cada tecnología del stack", () => {
    const html = buildNeuralRowHtml({ ...baseProject, tech: ["React", "Node.js"] }, 0);
    expect(html).toContain('<span class="ntech-pill">React</span>');
    expect(html).toContain('<span class="ntech-pill">Node.js</span>');
  });

  it("no genera el bloque de tech si el proyecto no tiene stack", () => {
    const html = buildNeuralRowHtml({ ...baseProject, tech: [] }, 0);
    expect(html).not.toContain("ntech");
  });

  it("escapa los nombres de tecnología", () => {
    const html = buildNeuralRowHtml({ ...baseProject, tech: ["<b>x</b>"] }, 0);
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
  });

  it("por defecto usa las etiquetas y enlaces en español", () => {
    const html = buildNeuralRowHtml(baseProject, 0);
    expect(html).toContain("EN PRODUCCIÓN");
    expect(html).toContain("Ver proyecto &rarr;");
  });

  it("con lang=\"en\" usa etiquetas y texto de enlace en inglés", () => {
    const html = buildNeuralRowHtml(baseProject, 0, "en");
    expect(html).toContain("IN PRODUCTION");
    expect(html).toContain("View project &rarr;");
    expect(html).not.toContain("EN PRODUCCIÓN");
  });

  it("con lang=\"en\" no añade el enlace a la calculadora NIS2 en español", () => {
    const html = buildNeuralRowHtml({ ...baseProject, id: "siam" }, 0, "en");
    expect(html).not.toContain("nis2-calculadora");
  });
});
