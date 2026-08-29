import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/projects.repository", () => ({
  findProjectById: vi.fn(),
}));

vi.mock("@/components/public/project-view-tracker", () => ({
  ProjectViewTracker: () => null,
}));

import { findProjectById } from "@/lib/repositories/projects.repository";
import ProjectDetailPage from "./page";

describe("página de detalle de proyecto", () => {
  it("dispara un 404 real de Next.js cuando el id no existe (no un div 'no encontrado' con 200)", async () => {
    vi.mocked(findProjectById).mockResolvedValue(null);

    await expect(
      ProjectDetailPage({ params: Promise.resolve({ id: "no-existe" }) }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
  });
});
