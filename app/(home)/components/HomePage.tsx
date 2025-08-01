import CompanionsSection from "./CompanionsSection";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection from "./FAQSection";

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
