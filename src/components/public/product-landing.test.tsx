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
});
