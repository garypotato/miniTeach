import { notFound } from "next/navigation";
import {
  getProductWithMetafields,
  transformProductToCompanion,
  Companion,
} from "../../../lib/shopify";
import CompanionDetailWrapper from "./CompanionDetailWrapper";
import CompanionDetailContent from "./CompanionDetailContent";

interface CompanionDetailProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompanion(id: string): Promise<Companion | null> {
  try {
    const result = await getProductWithMetafields(id);

    if (result.success && result.data) {
      return transformProductToCompanion(result.data);
    }

    return null;
  } catch (error) {
    console.error("Error in getCompanion:", error);
    return null;
  }
}

export default async function CompanionDetail({
  params,
}: CompanionDetailProps) {
  const { id } = await params;
  const companion = await getCompanion(id);

  if (!companion) {
    notFound();
  }

  const images = companion.images || (companion.image ? [companion.image] : []);

  return (
    <CompanionDetailWrapper companionTitle={companion.title}>
      <CompanionDetailContent companion={companion} images={images} />
    </CompanionDetailWrapper>
  );
}
