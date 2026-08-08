import { describe, it, expect, vi, beforeEach } from "vitest";

const launchMock = vi.fn();
vi.mock("puppeteer-core", () => ({
  default: { launch: (...args: unknown[]) => launchMock(...args) },
}));
vi.mock("@sparticuz/chromium", () => ({
  default: {
    args: ["--no-sandbox"],
    executablePath: vi.fn().mockResolvedValue("/fake/chromium"),
  },
}));

import { captureProjectScreenshot } from "./screenshot";

beforeEach(() => {
  launchMock.mockReset();
});

describe("captureProjectScreenshot", () => {
  it("devuelve el PNG capturado y cierra el navegador", async () => {
    const screenshotMock = vi.fn().mockResolvedValue(Buffer.from("fake-png"));
    const gotoMock = vi.fn().mockResolvedValue(undefined);
    const closeMock = vi.fn().mockResolvedValue(undefined);
    const newPageMock = vi.fn().mockResolvedValue({ goto: gotoMock, screenshot: screenshotMock });
    launchMock.mockResolvedValue({ newPage: newPageMock, close: closeMock });

    const result = await captureProjectScreenshot("https://example.com");

    expect(result.contentType).toBe("image/png");
    expect(result.buffer).toEqual(Buffer.from("fake-png"));
    expect(gotoMock).toHaveBeenCalledWith("https://example.com", expect.objectContaining({ timeout: 8000 }));
    expect(launchMock).toHaveBeenCalledWith(expect.objectContaining({
      args: ["--no-sandbox"],
      executablePath: "/fake/chromium",
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    }));
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("cierra el navegador incluso si falla la navegación", async () => {
    const closeMock = vi.fn().mockResolvedValue(undefined);
    const gotoMock = vi.fn().mockRejectedValue(new Error("timeout"));
    const newPageMock = vi.fn().mockResolvedValue({ goto: gotoMock, screenshot: vi.fn() });
    launchMock.mockResolvedValue({ newPage: newPageMock, close: closeMock });

    await expect(captureProjectScreenshot("https://example.com")).rejects.toThrow("timeout");
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
