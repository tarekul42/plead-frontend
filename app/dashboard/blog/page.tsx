"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, Calendar } from "lucide-react";

const posts = [
  { id: "1", title: "How AI is Transforming Real Estate Lead Management", status: "published", date: "Jun 15, 2026", views: 142 },
  { id: "2", title: "5 Tips for Closing More Deals in 2026", status: "published", date: "Jun 8, 2026", views: 89 },
  { id: "3", title: "The Ultimate Guide to Property Marketing", status: "draft", date: "May 25, 2026", views: 0 },
  { id: "4", title: "Getting Started with PropLead", status: "draft", date: "May 1, 2026", views: 0 },
];

export default function BlogManagementPage() {
  const [blogPosts, setBlogPosts] = useState(posts);

  const handleDelete = (id: string) => {
    setBlogPosts(blogPosts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-sm text-muted">{blogPosts.length} posts</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        {blogPosts.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No blog posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Views</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-[#1E293B]/50">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "published" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-1 text-muted">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </td>
                    <td className="p-4 flex items-center gap-1 text-muted">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/blog/${post.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-danger transition hover:bg-danger/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
