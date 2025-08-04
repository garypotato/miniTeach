import CompanionsSection from "./CompanionsSection";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection from "./FAQSection";
import { Companion } from "@/lib/shopify/types";

interface HomePageProps {
  initialCompanions: Companion[];
}

export default function HomePage({ initialCompanions }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CompanionsSection initialCompanions={initialCompanions} />
      <HowItWorksSection />
      <FAQSection />
    </div>
  );
}
