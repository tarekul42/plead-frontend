"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

const posts = [
  {
    title: "How AI is Transforming Real Estate Lead Management",
    excerpt: "Discover how artificial intelligence is revolutionizing the way agents qualify and convert leads.",
    date: "Jun 15, 2026",
    slug: "ai-real-estate-lead-management",
    tags: ["AI", "Leads"],
  },
  {
    title: "5 Tips for Closing More Deals in 2026",
    excerpt: "Proven strategies from top-performing agents to help you close more deals this year.",
    date: "Jun 8, 2026",
    slug: "closing-more-deals-2026",
    tags: ["Tips", "Sales"],
  },
  {
    title: "The Ultimate Guide to Property Marketing",
    excerpt: "From listing photos to AI-generated descriptions — everything you need to market properties effectively.",
    date: "May 25, 2026",
    slug: "property-marketing-guide",
    tags: ["Marketing", "Guide"],
  },
];

export function BlogTeaser() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Latest from the Blog</h2>
            <p className="mt-2 text-muted">Tips, guides, and industry insights</p>
          </div>
          <Link href="/blog" className="text-sm text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-card border border-border bg-background p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>
                <h3 className="mb-2 font-semibold leading-snug">{post.title}</h3>
                <p className="mb-4 text-sm text-muted line-clamp-2">{post.excerpt}</p>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
