import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/md-home", "/md-404"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/md-home", "/md-404"],
      },
    ],
    sitemap: "https://praxialabs.com/sitemap.xml",
    host: "https://praxialabs.com",
  };
}
