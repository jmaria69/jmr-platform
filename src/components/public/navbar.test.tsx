import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("en una ruta en español muestra los enlaces y el CTA en español", () => {
    mockPathname = "/siam";
    render(<Navbar />);
    expect(screen.getAllByText("Inicio")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Reservar demo")[0].closest("a")).toHaveAttribute("href", "/contacto");
  });

  it("en una ruta /en/* muestra los enlaces y el CTA en inglés", () => {
    mockPathname = "/en/siam";
    render(<Navbar />);
    expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Pricing")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Book a demo")[0].closest("a")).toHaveAttribute("href", "/contact");
  });

  it("el switcher apunta a la contraparte en inglés desde una ruta en español", () => {
    mockPathname = "/laboratorio";
    render(<Navbar />);
    const switchers = screen.getAllByText("EN");
    expect(switchers[0].closest("a")).toHaveAttribute("href", "/en/lab");
  });

  it("el switcher apunta a la contraparte en español desde una ruta en inglés", () => {
    mockPathname = "/en/pricing";
    render(<Navbar />);
    const switchers = screen.getAllByText("ES");
    expect(switchers[0].closest("a")).toHaveAttribute("href", "/precios");
  });

  it("el logo enlaza a la home del idioma actual", () => {
    mockPathname = "/en/adminapp";
    render(<Navbar />);
    expect(screen.getByText("PraxiaLabs").closest("a")).toHaveAttribute("href", "/en");
  });
});
