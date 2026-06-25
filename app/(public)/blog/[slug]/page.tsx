import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";

const posts: Record<string, { title: string; content: string[]; date: string; tags: string[] }> = {
  "ai-real-estate-lead-management": {
    title: "How AI is Transforming Real Estate Lead Management",
    date: "Jun 15, 2026",
    tags: ["AI", "Leads", "Technology"],
    content: [
      "The real estate industry has traditionally relied on manual processes for lead management — spreadsheets, sticky notes, and gut feelings. But that's changing rapidly. Artificial intelligence is transforming how agents qualify, prioritize, and convert leads.",
      "AI-powered lead scoring analyzes multiple data points simultaneously: budget, preferred location, property type, desired bedrooms, and even behavioral signals like email open rates and property page visits. The result is a ranked list of leads based on their likelihood to convert.",
      "PropLead's AI Match Engine takes this a step further. Instead of just scoring leads, it matches them against your actual property inventory. The AI considers budget fit, location preference, bedroom requirements, and property features to produce a comprehensive match score with detailed reasons.",
      "The impact is measurable: agencies using AI-powered matching report a 40% reduction in lead-to-close time and a 25% increase in conversion rates. Agents spend less time manually sorting through leads and more time closing deals.",
      "As AI technology continues to evolve, we expect even more sophisticated features: predictive analytics that forecast which properties will sell fastest, automated follow-up scheduling based on lead behavior, and personalized marketing campaigns generated entirely by AI.",
    ],
  },
  "closing-more-deals-2026": {
    title: "5 Tips for Closing More Deals in 2026",
    date: "Jun 8, 2026",
    tags: ["Tips", "Sales", "Strategy"],
    content: [
      "The real estate market in 2026 demands speed, precision, and personalization. Here are five proven strategies to close more deals this year.",
      "1. Use AI to Prioritize Leads: Not all leads are equal. Use AI-powered scoring to focus your energy on the highest-intent leads first. PropLead's Match Engine automatically ranks leads against your available properties.",
      "2. Personalize Every Interaction: Generic emails don't work. Use AI to generate personalized outreach that references specific properties and matches each lead's unique criteria. Personalized follow-ups have 3x higher response rates.",
      "3. Respond Faster: Speed to lead is critical. Aim to respond within 5 minutes of an inquiry. Use automated notifications and mobile access to stay responsive even when you're away from your desk.",
      "4. Track Everything: Every call, email, and meeting should be logged. Use interaction tracking to remember details from previous conversations and follow up intelligently. PropLead's interaction timeline makes this effortless.",
      "5. Leverage Data: Use analytics to understand what's working. Which lead sources perform best? Which property types close fastest? Which agents have the highest conversion rates? Data-driven decisions outperform intuition every time.",
    ],
  },
  "property-marketing-guide": {
    title: "The Ultimate Guide to Property Marketing",
    date: "May 25, 2026",
    tags: ["Marketing", "Guide"],
    content: [
      "Effective property marketing is the difference between a listing that sits for months and one that sells in days. Here's everything you need to know.",
      "High-quality photos are non-negotiable. Listings with professional photos sell 32% faster. But great photos are just the beginning. Today's buyers expect immersive experiences: virtual tours, detailed descriptions, and comprehensive feature lists.",
      "AI-generated property descriptions can save hours while maintaining quality. Provide the AI with key details (price, location, bedrooms, unique features) and it generates compelling copy in seconds. You can choose from multiple tones: luxury, family-friendly, or investment-focused.",
      "Social media amplification is essential. Share listings across Instagram, Facebook, and LinkedIn with consistent branding. Use high-quality visuals and targeted ads to reach potential buyers in specific locations and price ranges.",
      "Email marketing remains one of the most effective channels. Segment your list by buyer preferences and send personalized property recommendations. AI can help match properties to buyer profiles automatically.",
      "Finally, track everything. Use analytics to understand which marketing channels drive the most views, inquiries, and closed deals. Double down on what works and cut what doesn't.",
    ],
  },
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = posts[slug];

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-[#2563EB] hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{post.title}</span>
      </nav>

      <div className="mb-6 flex items-center gap-3 text-sm text-muted">
        <Calendar className="h-4 w-4" />
        <span>{post.date}</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold md:text-4xl">{post.title}</h1>

      <div className="space-y-5 text-muted leading-relaxed">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#2563EB]/5 px-3 py-1 text-sm text-[#2563EB]"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm text-[#2563EB] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>
    </article>
  );
}
