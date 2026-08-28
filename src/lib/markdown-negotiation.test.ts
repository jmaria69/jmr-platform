import { describe, expect, it } from "vitest";
import { prefersMarkdown, withMarkdownVary } from "./markdown-negotiation";

describe("prefersMarkdown", () => {
  it("prefiere markdown cuando es el único tipo pedido", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });

  it("no activa markdown para un navegador normal (Accept típico de Chrome)", () => {
    expect(
      prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    ).toBe(false);
  });

  it("respeta q= cuando markdown tiene menor prioridad que html", () => {
    expect(prefersMarkdown("text/markdown;q=0.5,text/html;q=0.9")).toBe(false);
  });

  it("activa markdown cuando iguala o supera la prioridad de html", () => {
    expect(prefersMarkdown("text/markdown;q=0.9,text/html;q=0.5")).toBe(true);
    expect(prefersMarkdown("text/markdown,text/html")).toBe(true);
  });

  it("ignora mayúsculas/espacios", () => {
    expect(prefersMarkdown(" Text/Markdown ; q=1.0 ")).toBe(true);
  });

  it("es false sin cabecera Accept", () => {
    expect(prefersMarkdown(null)).toBe(false);
  });

  it("es false si no se pide markdown en absoluto", () => {
    expect(prefersMarkdown("application/json")).toBe(false);
  });

  it("un Accept: */* genérico (curl, clientes sin Accept explícito) no activa markdown", () => {
    expect(prefersMarkdown("*/*")).toBe(false);
  });
});

describe("withMarkdownVary", () => {
  it("añade Accept y Accept-Encoding cuando no hay Vary previo", () => {
    expect(withMarkdownVary(null)).toBe("Accept, Accept-Encoding");
  });

  it("preserva los valores existentes y añade solo lo que falta", () => {
    expect(withMarkdownVary("rsc, next-router-state-tree")).toBe(
      "rsc, next-router-state-tree, Accept, Accept-Encoding"
    );
  });

  it("no duplica si ya están presentes (sin importar mayúsculas)", () => {
    expect(withMarkdownVary("accept, X-Foo")).toBe("accept, X-Foo, Accept-Encoding");
  });
});
