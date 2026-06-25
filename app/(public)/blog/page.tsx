import Link from "next/link";
import { Calendar } from "lucide-react";

const posts = [
  {
    title: "How AI is Transforming Real Estate Lead Management",
    excerpt: "Artificial intelligence is revolutionizing how agents qualify and convert leads. Learn how AI-powered lead scoring can 10x your conversion rate.",
    date: "Jun 15, 2026",
    slug: "ai-real-estate-lead-management",
    tags: ["AI", "Leads", "Technology"],
    author: "PropLead Team",
  },
  {
    title: "5 Tips for Closing More Deals in 2026",
    excerpt: "Proven strategies from top-performing agents across the country. Implement these techniques to boost your close rate this year.",
    date: "Jun 8, 2026",
    slug: "closing-more-deals-2026",
    tags: ["Tips", "Sales", "Strategy"],
    author: "PropLead Team",
  },
  {
    title: "The Ultimate Guide to Property Marketing",
    excerpt: "From listing photos to AI-generated descriptions, master every aspect of property marketing with this comprehensive guide.",
    date: "May 25, 2026",
    slug: "property-marketing-guide",
    tags: ["Marketing", "Guide"],
    author: "PropLead Team",
  },
  {
    title: "Multi-Tenant SaaS: Why Data Isolation Matters",
    excerpt: "Understanding how multi-tenant architecture protects your agency's data and why it matters for your business.",
    date: "May 18, 2026",
    slug: "multi-tenant-saas-data-isolation",
    tags: ["SaaS", "Security", "Architecture"],
    author: "PropLead Team",
  },
  {
    title: "AI vs Traditional Lead Scoring: A Comparison",
    excerpt: "We compare traditional rule-based lead scoring with modern AI-powered approaches. See which one delivers better results.",
    date: "May 10, 2026",
    slug: "ai-vs-traditional-lead-scoring",
    tags: ["AI", "Leads", "Comparison"],
    author: "PropLead Team",
  },
  {
    title: "Getting Started with PropLead: A Step-by-Step Guide",
    excerpt: "New to PropLead? Follow this guide to set up your account, add your first properties, and start matching leads.",
    date: "May 1, 2026",
    slug: "getting-started-proplead-guide",
    tags: ["Guide", "Getting Started"],
    author: "PropLead Team",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Blog</h1>
        <p className="text-muted">Tips, guides, and insights for real estate professionals</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-card border border-border bg-surface p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-2 text-xs text-muted">
              <Calendar className="h-3 w-3" />
              <span>{post.date}</span>
              <span className="text-border">|</span>
              <span>{post.author}</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold leading-snug group-hover:text-brand">
              {post.title}
            </h2>
            <p className="mb-4 text-sm text-muted line-clamp-3">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand/5 px-2.5 py-0.5 text-xs text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
