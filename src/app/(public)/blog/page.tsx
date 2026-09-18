"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { usePublicBlogList, type BlogPost } from "@/lib/queries/use-public";

export default function BlogPage() {
  const { data, isLoading } = usePublicBlogList();
  const posts = data?.data ?? [];

  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Blog</h1>
        <p className="text-muted">Tips, guides, and insights for real estate professionals</p>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-card border border-border bg-surface p-6"
            >
              <div className="mb-3 h-3 w-24 rounded bg-muted/20" />
              <div className="mb-2 h-5 w-3/4 rounded bg-muted/20" />
              <div className="mb-4 h-3 w-full rounded bg-muted/20" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div data-testid="blog-list" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPost) => {
            const title = post.title;
            const excerpt = post.excerpt || post.content?.slice(0, 160) + "...";
            const slug = post.slug;
            const tags = post.tags || [];
            const publishedAt = post.publishedAt;
            const author = (post as unknown as Record<string, unknown>)?.authorId as
              Record<string, unknown> | undefined;
            const authorName = author?.name as string | undefined;
            const date = publishedAt
              ? new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group rounded-card border border-border bg-surface p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  <span>{date}</span>
                  {authorName && (
                    <>
                      <span className="text-border">|</span>
                      <span>{authorName}</span>
                    </>
                  )}
                </div>
                <h2 className="mb-2 text-lg font-semibold leading-snug group-hover:text-brand">
                  {title}
                </h2>
                <p className="mb-4 text-sm text-muted line-clamp-3">{excerpt}</p>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
