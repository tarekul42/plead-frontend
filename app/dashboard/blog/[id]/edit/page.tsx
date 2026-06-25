"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/dashboard/blog"), 1500);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/blog" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Title</label>
              <input defaultValue="How AI is Transforming Real Estate" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Slug</label>
              <input defaultValue="ai-real-estate-transformation" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Excerpt</label>
              <textarea rows={2} defaultValue="How AI is changing the game..." className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] resize-y" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Content (Markdown)</label>
              <textarea rows={12} defaultValue="# Introduction\n\nAI is transforming real estate..." required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] resize-y font-mono" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saved}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Update"}
          </button>
          <Link
            href="/dashboard/blog"
            className="rounded-lg border border-border px-6 py-2.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
