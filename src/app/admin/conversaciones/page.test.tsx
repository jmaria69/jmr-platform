import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConversacionesPage from "./page";

function conversacion(producto: string, telefono: string, ts: string) {
  return {
    telefono,
    canal: "web" as const,
    total_mensajes: 2,
    ultimo_mensaje: `ultimo de ${telefono}`,
    ultimo_rol: "user",
    ultimo_timestamp: ts,
    producto,
    producto_nombre: producto === "saludapp" ? "SaludApp" : "Praxia Labs",
  };
}

const LISTA = {
  conversaciones: [
    conversacion("praxialabs", "web-aaaa1111", "2026-09-18T12:00:00.000000"),
    conversacion("saludapp", "web-bbbb2222", "2026-09-18T11:00:00.000000"),
  ],
  productos: [
    { id: "praxialabs", nombre: "Praxia Labs", color: "" },
    { id: "saludapp", nombre: "SaludApp", color: "" },
  ],
  fallos: [],
};

function respuesta(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as Response;
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("panel de conversaciones", () => {
  it("etiqueta cada conversación con su producto y filtra por él", async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(LISTA));
    const user = userEvent.setup();
    render(<ConversacionesPage />);

    await screen.findByText("web-aaaa1111");
    expect(screen.getByText("web-bbbb2222")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "SaludApp (1)" }));

    expect(screen.queryByText("web-aaaa1111")).toBeNull();
    expect(screen.getByText("web-bbbb2222")).toBeTruthy();
  });

  it("muestra el diagnóstico que manda el servidor en vez de uno genérico", async () => {
    vi.mocked(fetch).mockResolvedValue(
      respuesta({ error: "No hay ningún agente configurado" }, false, 503)
    );
    render(<ConversacionesPage />);

    await screen.findByText("No hay ningún agente configurado");
  });

  it("avisa cuando el hilo falla en vez de enseñarlo como vacío", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(respuesta(LISTA))
      .mockResolvedValueOnce(respuesta({ error: "El agente no respondió correctamente" }, false, 502));
    const user = userEvent.setup();
    render(<ConversacionesPage />);

    await user.click(await screen.findByText("web-aaaa1111"));

    await screen.findByText("El agente no respondió correctamente");
    expect(screen.queryByText("Sin mensajes.")).toBeNull();
  });

  it("no pinta el hilo de una conversación bajo la cabecera de otra", async () => {
    // El primer hilo tarda; el segundo llega antes. La respuesta tardía debe
    // descartarse: si no, se mezclarían mensajes de dos productos distintos.
    let resolverLento: (r: Response) => void = () => {};
    const lento = new Promise<Response>((r) => {
      resolverLento = r;
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce(respuesta(LISTA))
      .mockReturnValueOnce(lento)
      .mockResolvedValueOnce(
        respuesta({ mensajes: [{ role: "user", content: "mensaje de SaludApp", timestamp: null }] })
      );

    const user = userEvent.setup();
    render(<ConversacionesPage />);

    await user.click(await screen.findByText("web-aaaa1111"));
    await user.click(screen.getByText("web-bbbb2222"));
    await screen.findByText("mensaje de SaludApp");

    resolverLento(
      respuesta({ mensajes: [{ role: "user", content: "mensaje de Praxia", timestamp: null }] })
    );

    await waitFor(() => {
      expect(screen.queryByText("mensaje de Praxia")).toBeNull();
    });
    expect(screen.getByText("mensaje de SaludApp")).toBeTruthy();
  });
});
