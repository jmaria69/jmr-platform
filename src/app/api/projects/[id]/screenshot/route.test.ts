import { describe, it, expect, vi, beforeEach } from "vitest";

const verifyTokenMock = vi.fn();
vi.mock("@/lib/auth/session", () => ({
  SESSION_COOKIE: "jmr_session",
  verifyToken: (...a: unknown[]) => verifyTokenMock(...a),
}));

const findProjectByIdMock = vi.fn();
const updateProjectMock = vi.fn();
const ProjectNotFoundError = vi.hoisted(() => class ProjectNotFoundError extends Error {});
vi.mock("@/lib/repositories", () => ({
  findProjectById: (...a: unknown[]) => findProjectByIdMock(...a),
  updateProject: (...a: unknown[]) => updateProjectMock(...a),
  ProjectNotFoundError,
}));

const captureMock = vi.fn();
vi.mock("@/lib/screenshot", () => ({
  captureProjectScreenshot: (...a: unknown[]) => captureMock(...a),
}));

const putMock = vi.fn();
vi.mock("@vercel/blob", () => ({
  put: (...a: unknown[]) => putMock(...a),
}));

import { NextRequest } from "next/server";
import { PATCH } from "./route";

function req() {
  return new NextRequest("https://praxialabs.com/api/projects/olga-ai/screenshot", {
    method: "PATCH",
    headers: { cookie: "jmr_session=valid-token" },
  });
}
const params = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  verifyTokenMock.mockReset();
  findProjectByIdMock.mockReset();
  updateProjectMock.mockReset();
  captureMock.mockReset();
  putMock.mockReset();
});

describe("PATCH /api/projects/[id]/screenshot", () => {
  it("401 sin sesión válida", async () => {
    verifyTokenMock.mockResolvedValue(null);
    const res = await PATCH(req(), params("olga-ai"));
    expect(res.status).toBe(401);
    expect(captureMock).not.toHaveBeenCalled();
  });

  it("404 si el proyecto no existe", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue(null);
    const res = await PATCH(req(), params("no-existe"));
    expect(res.status).toBe(404);
  });

  it("400 si el proyecto no tiene URL", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: undefined });
    const res = await PATCH(req(), params("olga-ai"));
    expect(res.status).toBe(400);
    expect(captureMock).not.toHaveBeenCalled();
  });

  it("captura, sube a Blob y actualiza project.image — 200 con el proyecto actualizado", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: "https://olga.praxialabs.com" });
    captureMock.mockResolvedValue({ buffer: Buffer.from("png"), contentType: "image/png" });
    putMock.mockResolvedValue({ url: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });
    updateProjectMock.mockResolvedValue({ id: "olga-ai", image: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });

    const res = await PATCH(req(), params("olga-ai"));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.image).toBe("https://blob.vercel-storage.com/projects/olga-ai-123.png");
    expect(putMock).toHaveBeenCalledWith(
      expect.stringMatching(/^projects\/olga-ai-\d+\.png$/),
      expect.any(Buffer),
      expect.objectContaining({ access: "public", contentType: "image/png" }),
    );
    expect(updateProjectMock).toHaveBeenCalledWith("olga-ai", { image: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });
  });

  it("captura la landing de presentación en vez de la app externa cuando el proyecto tiene una", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "siam", url: "https://siem.praxialabs.com" });
    captureMock.mockResolvedValue({ buffer: Buffer.from("png"), contentType: "image/png" });
    putMock.mockResolvedValue({ url: "https://blob.vercel-storage.com/projects/siam-123.png" });
    updateProjectMock.mockResolvedValue({ id: "siam", image: "https://blob.vercel-storage.com/projects/siam-123.png" });

    await PATCH(req(), params("siam"));

    expect(captureMock).toHaveBeenCalledWith("https://praxialabs.com/siam");
  });

  it("502 si la captura falla, sin tocar project.image", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: "https://olga-caida.example.com" });
    captureMock.mockRejectedValue(new Error("timeout"));

    const res = await PATCH(req(), params("olga-ai"));

    expect(res.status).toBe(502);
    expect(updateProjectMock).not.toHaveBeenCalled();
  });
});
