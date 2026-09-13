import { renderProductOgImage, OG_SIZE } from "@/lib/product-og-image";
import { getProduct } from "@/content/products";

export const runtime = "edge";
export const alt = "Core OPS — Operaciones IT en un panel";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  const product = getProduct("core-ops")!;
  return renderProductOgImage({
    nombre: product.nombre,
    badge: product.badge,
    bajada: product.bajada,
    color: product.color,
    path: "/core-ops",
  });
}
