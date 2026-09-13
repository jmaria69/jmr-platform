import { renderProductOgImage, OG_SIZE } from "@/lib/product-og-image";
import { getProduct } from "@/content/products";

export const runtime = "edge";
export const alt = "SIAM — SOC virtual para pymes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  const product = getProduct("siam")!;
  return renderProductOgImage({
    nombre: product.nombre,
    badge: product.badge,
    bajada: product.bajada,
    color: product.color,
    path: "/siam",
  });
}
