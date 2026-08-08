import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Project } from "@/types";

const captureScreenshotMock = vi.fn();

const olgaProject: Project = {
  id: "olga-ai",
  name: "OLGA.ai",
  description: "desc",
  longDescription: "",
  tech: [],
  status: "production",
  category: "ai",
  url: "https://olga.praxialabs.com",
  image: "/projects/gws.svg",
  color: "#8b5cf6",
};

const secondProject: Project = {
  id: "praxia-labs",
  name: "Praxia Labs",
  description: "desc 2",
  longDescription: "",
  tech: [],
  status: "production",
  category: "web",
  url: "https://praxialabs.com",
  image: "/projects/praxia.svg",
  color: "#06b6d4",
};

// Mutable fixture read by the mocked hook on every render; tests that need a
// different project list reassign it before rendering, and beforeEach resets
// it back to the single-project default so tests stay independent.
let projectsFixture: Project[] = [olgaProject];

vi.mock("@/hooks/use-projects", () => ({
  useProjects: () => ({
    projects: projectsFixture,
    isLoading: false,
    error: null,
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    toggleStatus: vi.fn(),
    captureScreenshot: (...a: unknown[]) => captureScreenshotMock(...a),
  }),
}));

import { ProjectsManager } from "./projects-manager";

beforeEach(() => {
  captureScreenshotMock.mockReset();
  projectsFixture = [olgaProject];
});

describe("ProjectsManager — captura de pantalla", () => {
  it("dispara captureScreenshot con el id del proyecto al pulsar el botón", async () => {
    captureScreenshotMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProjectsManager />);

    await user.click(screen.getByRole("button", { name: /actualizar captura/i }));

    expect(captureScreenshotMock).toHaveBeenCalledWith("olga-ai");
  });

  it("muestra un estado de carga mientras captura y lo quita al terminar", async () => {
    let resolveCapture: () => void = () => {};
    captureScreenshotMock.mockReturnValue(new Promise<void>((r) => { resolveCapture = r; }));
    const user = userEvent.setup();
    render(<ProjectsManager />);

    await user.click(screen.getByRole("button", { name: /actualizar captura/i }));
    expect(screen.getByRole("button", { name: /actualizar captura/i })).toBeDisabled();

    resolveCapture();
    await waitFor(() => expect(screen.getByRole("button", { name: /actualizar captura/i })).not.toBeDisabled());
  });

  it("no muestra el botón en modo solo lectura", () => {
    render(<ProjectsManager isReadOnly />);
    expect(screen.queryByRole("button", { name: /actualizar captura/i })).not.toBeInTheDocument();
  });

  it("mantiene el estado de carga de un proyecto aunque se capture otro en paralelo", async () => {
    projectsFixture = [olgaProject, secondProject];

    let resolveFirst: () => void = () => {};
    let resolveSecond: () => void = () => {};
    captureScreenshotMock.mockImplementation((id: string) =>
      id === "olga-ai"
        ? new Promise<void>((r) => { resolveFirst = r; })
        : new Promise<void>((r) => { resolveSecond = r; })
    );

    const user = userEvent.setup();
    render(<ProjectsManager />);

    const [firstButton, secondButton] = screen.getAllByRole("button", { name: /actualizar captura/i });
    expect(firstButton).toBeDefined();
    expect(secondButton).toBeDefined();

    // Empieza a capturar el primer proyecto; su captura queda "en vuelo".
    await user.click(firstButton);
    expect(firstButton).toBeDisabled();
    expect(secondButton).not.toBeDisabled();

    // Sin que la primera termine, se captura el segundo proyecto.
    await user.click(secondButton);

    // Bug corregido: el primer botón debe seguir deshabilitado — antes, al
    // usar un único `capturingId` compartido, este clic reiniciaba el estado
    // del primero y lo dejaba pulsable de nuevo mientras su captura seguía activa.
    expect(firstButton).toBeDisabled();
    expect(secondButton).toBeDisabled();

    resolveFirst();
    await waitFor(() => expect(firstButton).not.toBeDisabled());
    // El segundo no debe verse afectado por que el primero haya terminado.
    expect(secondButton).toBeDisabled();

    resolveSecond();
    await waitFor(() => expect(secondButton).not.toBeDisabled());
  });
});
