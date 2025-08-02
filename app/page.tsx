import HomePage from "./(home)/components/HomePage";
import {
  getProducts,
  transformProductToCompanion,
  Companion,
} from "./services/shopify";

// Simple server-side shuffle using Math.random() 
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

async function getInitialCompanions(): Promise<Companion[]> {
  try {
    const result = await getProducts({
      collection_id: "491355177275", // Companion collection ID
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images",
      limit: 50, // Get more companions to have better randomization
    });

    if (result.success && result.data && result.data.length > 0) {
      const transformedData = result.data.map(transformProductToCompanion);
      
      // Server-side shuffle for different companions each visit
      const shuffledData = shuffleArray(transformedData);
      
      // Return first 8 shuffled companions for optimal 4-column layout
      return shuffledData.slice(0, 8);
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
