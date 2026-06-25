"use client";

import { useState } from "react";
import { Star, Check, X, MoreHorizontal } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const sampleReviews = [
  { id: "1", property: "Modern 3BR in Brooklyn", user: "Alice W.", rating: 5, comment: "Excellent property, well-maintained and great location.", status: "pending", date: "Jun 24, 2026" },
  { id: "2", property: "Luxury Condo, Manhattan", user: "Bob K.", rating: 4, comment: "Beautiful views but a bit pricey for the area.", status: "approved", date: "Jun 22, 2026" },
  { id: "3", property: "Cozy Studio, Downtown", user: "Carol S.", rating: 2, comment: "Not as described. Much smaller than the photos suggest.", status: "pending", date: "Jun 20, 2026" },
  { id: "4", property: "Family Home, Suburbs", user: "David L.", rating: 5, comment: "Perfect family home. Great schools nearby.", status: "approved", date: "Jun 18, 2026" },
  { id: "5", property: "Beachfront Villa", user: "Emma R.", rating: 1, comment: "Spam review - please remove.", status: "flagged", date: "Jun 15, 2026" },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(sampleReviews);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-sm text-muted">Approve or remove property reviews</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reviews" value={reviews.length} icon={Star} />
        <StatCard title="Approved" value={reviews.filter((r) => r.status === "approved").length} icon={Check} />
        <StatCard title="Pending" value={reviews.filter((r) => r.status === "pending").length} icon={MoreHorizontal} />
        <StatCard title="Flagged" value={reviews.filter((r) => r.status === "flagged").length} icon={X} />
      </div>

      <div className="mb-4 flex gap-2">
        {["all", "pending", "approved", "flagged"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-xs transition ${
              filter === f
                ? "bg-brand text-white"
                : "border border-border hover:bg-neutral-100 dark:hover:bg-surface"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No reviews to moderate.</p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((review) => (
              <div key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{review.property}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.status === "approved" ? "bg-success/10 text-success" :
                        review.status === "flagged" ? "bg-danger/10 text-danger" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <span>{review.user}</span>
                      <span>|</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-warning fill-[#F59E0B]" : "text-border"}`} />
                        ))}
                      </div>
                      <span>|</span>
                      <span>{review.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-success/30 text-success transition hover:bg-success/5"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/5"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {review.status === "approved" && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {review.status === "flagged" && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
