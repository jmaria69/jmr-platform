import { renderProductOgImage, OG_SIZE } from "@/lib/product-og-image";
import { getProductEn } from "@/content/products-en";

export const runtime = "edge";
export const alt = "Core OPS — Unified IT operations";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  const product = getProductEn("core-ops")!;
  return renderProductOgImage({
    nombre: product.nombre,
    badge: product.badge,
    bajada: product.bajada,
    color: product.color,
    path: "/en/core-ops",
  });
}
