import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage, { metadata } from "./page";

describe("about page (English)", () => {
  it("declares its own canonical URL and Spanish alternate", () => {
    expect(metadata.alternates?.canonical).toBe("/about");
    expect(metadata.alternates?.languages).toMatchObject({ es: "/acerca-de" });
  });

  it("renders at least 500 characters of readable content", () => {
    const html = renderToStaticMarkup(<AboutPage />);
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    expect(text.length).toBeGreaterThanOrEqual(500);
  });

  it("renders a single H1 and explains what the company does", () => {
    const html = renderToStaticMarkup(<AboutPage />);
    expect(html.match(/<h1[^>]*>/g)).toHaveLength(1);
    expect(html).toContain("AI automation studio");
    expect(html).toContain("Madrid, Spain");
  });
});
