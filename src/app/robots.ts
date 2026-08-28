import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/md-home"],
      },
    ],
    sitemap: "https://praxialabs.com/sitemap.xml",
  };
}
