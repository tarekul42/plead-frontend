import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { PropertyCategories } from "@/components/landing/property-categories";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiFeaturesShowcase } from "@/components/landing/ai-features-showcase";
import { TopRatedProperties } from "@/components/landing/top-rated-properties";
import { Testimonials } from "@/components/landing/testimonials";
import { OutcomesChart } from "@/components/landing/outcomes-chart";
import { BlogTeaser } from "@/components/landing/blog-teaser";
import { Faq } from "@/components/landing/faq";
import { NewsletterCta } from "@/components/landing/newsletter-cta";
import { FinalCta } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <FeaturedProperties />
      <PropertyCategories />
      <HowItWorks />
      <AiFeaturesShowcase />
      <TopRatedProperties />
      <Testimonials />
      <OutcomesChart />
      <BlogTeaser />
      <Faq />
      <NewsletterCta />
      <FinalCta />
    </div>
  );
}
