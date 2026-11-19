import { Hero } from "@/components/home/hero";
import { DemoSection } from "@/components/home/demo";
import { FaqSection } from "@/components/home/faq";
import {
  AppsMarquee,
  AppsShowcase,
  ComparisonSection,
  FinalCta,
  PricingSection,
  ReasonsSection,
  StepsSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AppsMarquee />
      <StepsSection />
      <ReasonsSection />
      <DemoSection />
      <ComparisonSection />
      <PricingSection />
      <AppsShowcase />
      <FaqSection />
      <FinalCta />
    </>
  );
}
