import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PrivacyPage, { metadata } from "./page";

describe("privacy policy page (English)", () => {
  it("declares its own canonical URL and Spanish alternate", () => {
    expect(metadata.alternates?.canonical).toBe("/privacy");
    expect(metadata.alternates?.languages).toMatchObject({ es: "/politica-privacidad" });
  });

  it("renders at least 500 characters of readable content", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    expect(text.length).toBeGreaterThanOrEqual(500);
  });

  it("explains what data is collected and how to exercise rights", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    expect(html).toContain("Contact form");
    expect(html).toContain("Google Analytics");
    expect(html).toContain("rights of access");
  });
});
