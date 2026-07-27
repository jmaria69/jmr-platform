import { describe, expect, it, vi, beforeEach } from "vitest";

const { projectView } = vi.hoisted(() => ({
  projectView: { create: vi.fn(), groupBy: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { projectView } }));

import { recordProjectView, getProjectViewCounts } from "./project-views.repository";

beforeEach(() => {
  projectView.create.mockReset();
  projectView.groupBy.mockReset();
});

describe("recordProjectView", () => {
  it("inserta la vista recortando campos largos", async () => {
    projectView.create.mockResolvedValue({});
    await recordProjectView("siam", { referer: "r", userAgent: "a".repeat(500), ipHash: "h" });
    const arg = projectView.create.mock.calls[0][0];
    expect(arg.data.projectId).toBe("siam");
    expect(arg.data.userAgent.length).toBe(300);
  });

  it("no lanza si la BD falla (el tracking nunca rompe la navegación)", async () => {
    projectView.create.mockRejectedValue(new Error("db down"));
    await expect(recordProjectView("siam", {})).resolves.toBeUndefined();
  });
});

describe("getProjectViewCounts", () => {
  it("mapea total, last7d y únicos por proyecto", async () => {
    projectView.groupBy.mockImplementation((args: { where?: unknown; by: string[] }) => {
      if (args.by.includes("ipHash")) {
        return Promise.resolve([
          { projectId: "siam", ipHash: "h1" },
          { projectId: "siam", ipHash: "h2" },
          { projectId: "crm-it", ipHash: "h3" },
        ]);
      }
      if (args.where) return Promise.resolve([{ projectId: "siam", _count: { _all: 5 } }]);
      return Promise.resolve([
        { projectId: "siam", _count: { _all: 20 } },
        { projectId: "crm-it", _count: { _all: 3 } },
      ]);
    });

    const counts = await getProjectViewCounts();
    expect(counts["siam"]).toEqual({ total: 20, last7d: 5, uniques: 2 });
    expect(counts["crm-it"]).toEqual({ total: 3, last7d: 0, uniques: 1 });
  });

  it("devuelve {} si la BD falla", async () => {
    projectView.groupBy.mockRejectedValue(new Error("db down"));
    expect(await getProjectViewCounts()).toEqual({});
  });
});
