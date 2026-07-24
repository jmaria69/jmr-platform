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
    const conFuente = siam.dolores.filter((d) => d.fuente);
    const enlaces = screen.getAllByRole("link", { name: /^Fuente:/ });
    expect(enlaces).toHaveLength(conFuente.length);
    for (const e of enlaces) {
      expect(e).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
      expect(e).toHaveAttribute("target", "_blank");
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
});
