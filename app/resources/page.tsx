import { getBooks } from "../../lib/shopify";
import ResourcesContent from "./ResourcesContent";

// Disable caching to always fetch latest data from Shopify
export const revalidate = 0;

export default async function ResourcesPage() {
  const booksResult = await getBooks();

  if (!booksResult.success || !booksResult.data) {
    return <ResourcesContent books={[]} hasError={true} />;
  }

  return <ResourcesContent books={booksResult.data} />;
}
