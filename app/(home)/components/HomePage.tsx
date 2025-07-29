"use client";

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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CompanionsSection initialCompanions={initialCompanions} />
      <FAQSection />
    </div>
  );
}
