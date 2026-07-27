import { describe, expect, it, vi, beforeEach } from "vitest";

const recordProjectView = vi.fn();
vi.mock("@/lib/repositories", () => ({
  recordProjectView: (...a: unknown[]) => recordProjectView(...a),
}));

import { NextRequest } from "next/server";
import { POST } from "./route";

function req(ua: string) {
  return new NextRequest("https://praxialabs.com/api/projects/siam/view", {
    method: "POST",
    headers: { "user-agent": ua, "x-forwarded-for": "9.9.9.9", referer: "https://praxialabs.com/laboratorio" },
  });
}
const params = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => recordProjectView.mockReset());

describe("POST /api/projects/[id]/view", () => {
  it("registra la vista de un humano con IP hasheada y responde 204", async () => {
    const res = await POST(req("Mozilla/5.0 (Macintosh)"), params("siam"));
    expect(res.status).toBe(204);
    expect(recordProjectView).toHaveBeenCalledTimes(1);
    const [projectId, meta] = recordProjectView.mock.calls[0];
    expect(projectId).toBe("siam");
    expect(meta.ipHash).toMatch(/^[a-f0-9]{32}$/);
    expect(JSON.stringify(meta)).not.toContain("9.9.9.9");
  });

  it("no cuenta a los bots (204 sin registrar)", async () => {
    const res = await POST(req("Googlebot/2.1"), params("siam"));
    expect(res.status).toBe(204);
    expect(recordProjectView).not.toHaveBeenCalled();
  });

  it("responde 400 si falta el id de proyecto", async () => {
    const res = await POST(req("Mozilla/5.0"), params(""));
    expect(res.status).toBe(400);
    expect(recordProjectView).not.toHaveBeenCalled();
  });

  it("da el mismo hash para la misma IP+UA (para poder contar únicos)", async () => {
    await POST(req("Mozilla/5.0"), params("siam"));
    await POST(req("Mozilla/5.0"), params("siam"));
    expect(recordProjectView.mock.calls[0][1].ipHash).toBe(recordProjectView.mock.calls[1][1].ipHash);
  });
});
