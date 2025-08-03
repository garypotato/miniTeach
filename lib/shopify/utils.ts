import { ShopifyProduct, Companion } from "./types";
import { processMetafields } from "./metafields";

export function transformProductToCompanion(
  product: ShopifyProduct
): Companion {
  return {
    id: product.id,
    title: product.title,
    body_html: product.body_html,
    handle: product.handle,
    image:
      product.images && product.images.length > 0
        ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.title,
          }
        : undefined,
    images: product.images?.map((img) => ({
      src: img.src,
      alt: img.alt || product.title,
    })),
    metafields: product.metafields
      ? processMetafields(product.metafields)
      : undefined,
  };
}