import { getServerAuthSession } from "@/lib/auth";
import { getProductWithMetafields, transformProductToCompanion } from "@/lib/shopify";
import { redirect } from "next/navigation";

export async function getCompanionProfile() {
  // Get the current session server-side
  const session = await getServerAuthSession();
  
  if (!session?.user) {
    redirect("/companion/login");
  }

  const companionId = (session.user as { id?: string })?.id;
  
  if (!companionId) {
    throw new Error("Companion ID not found in session");
  }

  try {
    // Fetch companion data using existing server-side function
    const result = await getProductWithMetafields(companionId);

    if (!result.success || !result.data) {
      throw new Error(result.error || "Companion not found");
    }

    // Transform the product data to companion format
    const companion = transformProductToCompanion(result.data);
    
    return companion;
  } catch (error) {
    console.error("Error fetching companion profile:", error);
    throw new Error("Failed to fetch companion profile");
  }
}

