import HomePage from "./(home)/components/HomePage";
import {
  getProducts,
  transformProductToCompanion,
  Companion,
} from "./services/shopify";

// Remove server-side shuffling to prevent hydration mismatch
// Shuffling will be handled client-side only

async function getInitialCompanions(): Promise<Companion[]> {
  try {
    const result = await getProducts({
      collection_id: "491355177275", // Companion collection ID
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images",
      limit: 50,
    });

    if (result.success && result.data && result.data.length > 0) {
      const transformedData = result.data.map(transformProductToCompanion);
      // Return first 8 companions without shuffling to prevent hydration mismatch
      return transformedData.slice(0, 8);
    }
    return [];
  } catch (error) {
    console.error("Error fetching initial companions:", error);
    return [];
  }
}

export default async function Home() {
  const initialCompanions = await getInitialCompanions();

  return <HomePage initialCompanions={initialCompanions} />;
}
