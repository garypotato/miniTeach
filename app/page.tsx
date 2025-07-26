import HomePage from "./components/HomePage";
import { getProducts } from "./lib/shopify";

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
}

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  image?: {
    src: string;
    alt: string | null;
  };
}

// Helper function to transform Shopify product data
function transformShopifyProduct(product: ShopifyProduct): Companion {
  return {
    id: product.id,
    title: product.title,
    body_html: product.body_html,
    handle: product.handle,
    // Transform images array to single image object (use first image)
    image:
      product.images && product.images.length > 0
        ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.title,
          }
        : undefined,
  };
}

const shuffleArray = (array: Companion[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

async function getInitialCompanions(): Promise<Companion[]> {
  try {
    const result = await getProducts({
      collection_id: "491355177275",
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images",
    });

    if (result.success && result.data) {
      // Transform the data to ensure proper image structure
      const transformedData = result.data.map(transformShopifyProduct);
      return shuffleArray(transformedData).slice(0, 8);
    }
    return [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialCompanions = await getInitialCompanions();

  return <HomePage initialCompanions={initialCompanions} />;
}
