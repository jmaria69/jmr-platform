import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PoliticaPrivacidadPage, { metadata } from "./page";

describe("página de política de privacidad", () => {
  it("declara su propia URL canónica", () => {
    expect(metadata.alternates?.canonical).toBe("/politica-privacidad");
  });

  it("renderiza al menos 500 caracteres de contenido de texto", () => {
    const html = renderToStaticMarkup(<PoliticaPrivacidadPage />);
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    expect(text.length).toBeGreaterThanOrEqual(500);
  });

  it("explica qué datos se recogen y cómo ejercer derechos", () => {
    const html = renderToStaticMarkup(<PoliticaPrivacidadPage />);
    expect(html).toContain("formulario de contacto");
    expect(html).toContain("Google Analytics");
    expect(html).toContain("derechos de acceso");
  });
});
