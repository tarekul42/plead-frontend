import { AiFeaturesShowcase } from "@/components/landing/ai-features-showcase";
import { BlogTeaser } from "@/components/landing/blog-teaser";
import { Faq } from "@/components/landing/faq";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { FinalCta } from "@/components/landing/final-cta";
import { GradientDivider } from "@/components/landing/gradient-divider";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { NewsletterCta } from "@/components/landing/newsletter-cta";
import { OutcomesChart } from "@/components/landing/outcomes-chart";
import { PropertyCategories } from "@/components/landing/property-categories";
import { StatsBar } from "@/components/landing/stats-bar";
import { Testimonials } from "@/components/landing/testimonials";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <StatsBar />
      <FeaturedProperties />
      <PropertyCategories />
      <GradientDivider />
      <HowItWorks />
      <AiFeaturesShowcase />
      <GradientDivider />
      <Testimonials />
      <OutcomesChart />
      <BlogTeaser />
      <Faq />
      <NewsletterCta />
      <FinalCta />
    </div>
  );
}
