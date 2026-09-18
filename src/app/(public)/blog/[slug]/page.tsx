"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { usePublicBlogPost } from "@/lib/queries/use-public";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading, error } = usePublicBlogPost(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-brand hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  const publishedAt = post.publishedAt as string;
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  const tags = (post.tags || []) as string[];
  const content = post.content as string;
  const title = post.title as string;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="mb-6 flex items-center gap-3 text-sm text-muted">
        <Calendar className="h-4 w-4" />
        <span>{date}</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold md:text-4xl">{title}</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {content.split("\n\n").map((paragraph: string, i: number) => (
          <p key={i} className="text-muted leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="rounded-full bg-brand/5 px-3 py-1 text-sm text-brand">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>
    </article>
  );
}
