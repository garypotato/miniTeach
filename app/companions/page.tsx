import { notFound } from "next/navigation";
import CompanionsPagination from "./components/CompanionsPagination";
import SearchFilter from "./components/SearchFilter";
import CompanionPageWrapper from "./components/CompanionPageWrapper";
import {
  getProductsWithMetafields,
  transformProductToCompanion,
  Companion,
} from "../../lib/shopify";

interface CompanionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    cities?: string;
  }>;
}

async function getAllCompanions(): Promise<Companion[]> {
  try {
    const result = await getProductsWithMetafields({
      collection_id: "491355177275", // Companion collection ID
      status: "active",
      published_status: "published",
      limit: 250,
      fields: "id,title,body_html,handle,images,vendor,product_type,tags",
    });

    if (result.success && result.data) {
      return result.data.map(transformProductToCompanion);
    }

    return [];
  } catch (error) {
    console.error("Error in getAllCompanions:", error);
    return [];
  }
}

// Helper function to extract text from HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

export default async function CompanionsPage({
  searchParams,
}: CompanionsPageProps) {
  const {
    page: pageParam,
    search: searchParam,
    cities: citiesParam,
  } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const searchQuery = searchParam || "";
  const selectedCities = citiesParam
    ? citiesParam.split(",").filter((city: string) => city.trim())
    : [];
  console.log("Selected Cities:", selectedCities);
  const companionsPerPage = 8;

  if (page < 1) {
    notFound();
  }

  // Get all companions with proper Shopify API pagination
  // This fetches ALL products using Shopify's nextPageParameters
  // for collections larger than 250 items (Shopify's max per request)
  const allCompanions = await getAllCompanions();

  // Check if any companions have location metafields for filtering
  const companionsWithLocation = allCompanions.filter(
    (c) => c.metafields?.location
  );

  // Enhanced filter companions based on search query and selected cities
  const filteredCompanions = allCompanions.filter((companion) => {
    // Search filter
    const matchesSearch =
      !searchQuery.trim() ||
      (() => {
        const query = searchQuery.toLowerCase().trim();
        const cleanBodyText = stripHtml(companion.body_html).toLowerCase();
        return (
          companion.title.toLowerCase().includes(query) ||
          companion.vendor?.toLowerCase().includes(query) ||
          companion.product_type?.toLowerCase().includes(query) ||
          companion.tags?.toLowerCase().includes(query) ||
          cleanBodyText.includes(query)
        );
      })();

    // City filter - check the location metafield
    const matchesCities =
      selectedCities.length === 0 ||
      (() => {
        const companionLocation =
          companion.metafields?.location?.toLowerCase() || "";

        // If no metafields location is available, exclude from location filter
        if (!companionLocation && selectedCities.length > 0) {
          return false;
        }

        // Map English city names to their Chinese equivalents for better matching
        const cityNameMapping: Record<string, string[]> = {
          sydney: ["sydney", "悉尼", "雪梨"],
          melbourne: ["melbourne", "墨尔本"],
          brisbane: ["brisbane", "布里斯班", "布里斯本"],
          adelaide: ["adelaide", "阿德莱德", "阿德雷德"],
          "gold coast": ["gold coast", "黄金海岸", "Gold Coast", "goldCoast"],
        };
        return selectedCities.some((city: string) => {
          const cityLower = city.toLowerCase();
          const searchTerms = cityNameMapping[cityLower] || [cityLower];
          return searchTerms.some((term) =>
            companionLocation.includes(term.toLowerCase())
          );
        });
      })();

    return matchesSearch && matchesCities;
  });

  const totalPages = Math.ceil(filteredCompanions.length / companionsPerPage);

  if (page > totalPages && totalPages > 0) {
    notFound();
  }

  const startIndex = (page - 1) * companionsPerPage;
  const endIndex = startIndex + companionsPerPage;
  const currentCompanions = filteredCompanions.slice(startIndex, endIndex);

  return (
    <CompanionPageWrapper
      selectedCities={selectedCities}
      filteredCompanions={filteredCompanions}
      companionsWithLocation={companionsWithLocation}
      allCompanions={allCompanions}
    >
      {/* Search Filter */}
      <SearchFilter
        initialSearch={searchQuery}
        initialCities={selectedCities}
      />

      <CompanionsPagination
        companions={currentCompanions}
        currentPage={page}
        totalPages={totalPages}
        totalCompanions={filteredCompanions.length}
        searchQuery={searchQuery}
      />
    </CompanionPageWrapper>
  );
}
