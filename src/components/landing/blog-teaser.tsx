"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { usePublicBlogList } from "@/lib/queries/use-public";

export function BlogTeaser() {
  const { data, isLoading } = usePublicBlogList({ limit: 3 });
  const posts = data?.data ?? [];

  if (isLoading) {
    return (
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Latest from the Blog</h2>
              <p className="mt-2 text-muted">Tips, guides, and industry insights</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-card border border-border bg-background p-6">
                <div className="mb-3 h-3 w-24 rounded bg-muted/20" />
                <div className="mb-2 h-5 w-3/4 rounded bg-muted/20" />
                <div className="mb-4 h-3 w-full rounded bg-muted/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

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
          {posts.map((post: Record<string, unknown>, i: number) => {
            const title = post.title as string;
            const excerpt = (post.excerpt || (post.content as string)?.slice(0, 120) + "...") as string;
            const slug = post.slug as string;
            const tags = (post.tags || []) as string[];
            const publishedAt = post.publishedAt as string;
            const date = publishedAt
              ? new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";

            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/blog/${slug}`}
                  className="block rounded-card border border-border bg-background p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    <span>{date}</span>
                  </div>
                  <h3 className="mb-2 font-semibold leading-snug">{title}</h3>
                  <p className="mb-4 text-sm text-muted line-clamp-2">{excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
