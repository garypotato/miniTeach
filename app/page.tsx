import HomePage from "./components/HomePage";
import { getProducts } from "./lib/shopify";

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
    const result = await getProducts({ collection_id: "491355177275" });

    if (result.success && result.data) {
      return shuffleArray(result.data).slice(0, 8);
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
