import { ShopifyProduct, Companion } from "./types";
import { processMetafields } from "./metafields";

/**
 * Generate age range from age number
 * @param age - The age as string or number
 * @returns Age range string (e.g., "20-29", "30-39")
 */
export function generateAgeRange(age: string | number): string {
  const ageNum = typeof age === 'string' ? parseInt(age) : age;
  
  if (isNaN(ageNum) || ageNum < 0) {
    return "";
  }
  
  const rangeStart = Math.floor(ageNum / 10) * 10;
  const rangeEnd = rangeStart + 9;
  
  return `${rangeStart}-${rangeEnd}`;
}

export function transformProductToCompanion(
  product: ShopifyProduct
): Companion {
  return {
    id: product.id,
    title: product.title,
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