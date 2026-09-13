import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductLanding } from "./product-landing";
import { PRODUCTS, getProduct } from "@/content/products";

const siam = getProduct("siam")!;

describe("ProductLanding", () => {
  it("renderiza badge, titular, bajada y promesa del producto", () => {
    render(<ProductLanding product={siam} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(siam.titular);
    expect(screen.getByText(siam.badge)).toBeInTheDocument();
    expect(screen.getByText(siam.bajada)).toBeInTheDocument();
    expect(screen.getByText(siam.promesa)).toBeInTheDocument();
  });

  it("renderiza cada dolor del producto", () => {
    render(<ProductLanding product={siam} />);
    for (const d of siam.dolores) {
      expect(screen.getByText(d.texto)).toBeInTheDocument();
    }
  });

  it("muestra un enlace de fuente por cada dolor con cifra", () => {
    render(<ProductLanding product={siam} />);
    const enlaces = screen.getAllByRole("link", { name: /^Fuente:/ });
    for (const d of siam.dolores) {
      if (!d.fuente) continue;
      const enlace = enlaces.find((a) => a.getAttribute("href") === d.fuente!.url);
      expect(enlace, `falta enlace de fuente para el dolor ${d.fuente!.url}`).toBeTruthy();
      expect(enlace).toHaveAttribute("target", "_blank");
      expect(enlace).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    }
  });

  it("enlaza a la app real en directo, distinta del CTA de conversión", () => {
    for (const p of PRODUCTS) {
      const { unmount } = render(<ProductLanding product={p} />);
      const enlace = screen.getByRole("link", { name: /Ver la app en directo/i });
      expect(enlace).toHaveAttribute("href", p.appUrl);
      expect(enlace).toHaveAttribute("target", "_blank");
      unmount();
    }
  });

  it("renderiza los hijos que se le pasan", () => {
    render(
      <ProductLanding product={siam}>
        <div data-testid="extra">calculadora</div>
      </ProductLanding>
    );
    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });

  it("no menciona IA en el titular de ningún producto", () => {
    for (const p of PRODUCTS) {
      const { unmount } = render(<ProductLanding product={p} />);
      expect(screen.getByRole("heading", { level: 1 }).textContent).not.toMatch(
        /\bIA\b|inteligencia artificial/i
      );
      unmount();
    }
  });

  it("renderiza como enlace visible cada fuente a nivel de producto", () => {
    for (const p of PRODUCTS) {
      const { unmount } = render(<ProductLanding product={p} />);
      const enlaces = screen.queryAllByRole("link", { name: /^Fuente:/ });
      for (const f of p.fuentes) {
        const enlace = enlaces.find((a) => a.getAttribute("href") === f.url);
        expect(enlace, `falta enlace de fuente para ${f.url} en ${p.slug}`).toBeTruthy();
        expect(enlace).toHaveAttribute("target", "_blank");
      }
      unmount();
    }
  });

  it("incluye JSON-LD de tipo Service con la URL canónica de cada producto", () => {
    for (const p of PRODUCTS) {
      const { container, unmount } = render(
        <ProductLanding product={p} canonicalPath={`/${p.slug}`} />
      );
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script, `falta JSON-LD para ${p.slug}`).toBeTruthy();
      const data = JSON.parse(script!.innerHTML);
      expect(data["@type"]).toBe("Service");
      expect(data.name).toBe(p.nombre);
      expect(data.url).toBe(`https://praxialabs.com/${p.slug}`);
      unmount();
    }
  });

  it("deriva la URL canónica del slug cuando no se pasa canonicalPath", () => {
    const { container } = render(<ProductLanding product={siam} lang="en" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.innerHTML);
    expect(data.url).toBe(`https://praxialabs.com/en/${siam.slug}`);
  });

  it('con lang="en" traduce el chrome estático (CTA, encabezados, enlace de contacto)', () => {
    render(<ProductLanding product={siam} lang="en" />);
    expect(screen.getByRole("link", { name: /See the app live/i })).toBeInTheDocument();
    expect(screen.getByText("Why this is a problem today")).toBeInTheDocument();
    expect(screen.getByText(`What ${siam.nombre} does`)).toBeInTheDocument();
    const callLink = screen.getByRole("link", { name: /Book a call/i });
    expect(callLink).toHaveAttribute("href", "/contact");
  });
});
