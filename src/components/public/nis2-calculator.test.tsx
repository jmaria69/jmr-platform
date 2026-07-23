import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nis2Calculator } from "./nis2-calculator";

describe("Nis2Calculator", () => {
  it("clasifica como entidad importante con los valores por defecto", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText("Entidad importante")).toBeInTheDocument();
  });

  it("muestra las obligaciones de notificación cuando aplica la directiva", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText(/24 h/)).toBeInTheDocument();
    expect(screen.getByText(/72 h/)).toBeInTheDocument();
  });

  it("pasa a fuera de ámbito al elegir un sector no listado", async () => {
    const user = userEvent.setup();
    render(<Nis2Calculator />);
    await user.selectOptions(screen.getByRole("combobox"), "otro");
    expect(screen.getByText("Fuera del ámbito")).toBeInTheDocument();
    expect(screen.queryByText(/exposición estimada/)).not.toBeInTheDocument();
  });

  it("advierte de que no hay plazo legal vigente en España", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText(/no ha transpuesto todavía la directiva/i)).toBeInTheDocument();
  });

  it("cita las fuentes como enlaces externos", () => {
    render(<Nis2Calculator />);
    const fuentes = screen.getAllByRole("link", { name: /^Fuente:/ });
    expect(fuentes.length).toBeGreaterThan(0);
    for (const f of fuentes) {
      expect(f).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    }
  });

  it("no promete impedir ataques ni despliegue en 48 h", () => {
    const { container } = render(<Nis2Calculator />);
    expect(container.textContent).not.toMatch(/48\s*h|no te (van a )?atacar/i);
  });
});
