import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

function req() {
  return new NextRequest("https://praxialabs.com/md-404");
}

describe("GET /md-404", () => {
  it("responde con status 404", async () => {
    const res = await GET(req());
    expect(res.status).toBe(404);
  });

  it("responde con Content-Type text/markdown", async () => {
    const res = await GET(req());
    expect(res.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
  });

  it("añade Accept y Accept-Encoding a Vary", async () => {
    const res = await GET(req());
    expect(res.headers.get("Vary")).toBe("Accept, Accept-Encoding");
  });

  it("enlaza a la home, proyectos, sitemap y llms.txt", async () => {
    const res = await GET(req());
    const body = await res.text();
    expect(body).toContain("https://praxialabs.com/");
    expect(body).toContain("https://praxialabs.com/proyectos");
    expect(body).toContain("https://praxialabs.com/sitemap.xml");
    expect(body).toContain("https://praxialabs.com/llms.txt");
  });
});
