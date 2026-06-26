"use client";

import { useState } from "react";
import { Star, Check, X, MoreHorizontal, Loader2 } from "lucide-react";
import { useReviews, useApproveReview, useDeleteReview } from "@/lib/queries/use-reviews";
import { StatCard } from "@/components/dashboard/stat-card";

const statusMap = [
  { label: "All", value: "all", filter: undefined },
  { label: "Pending", value: "pending", filter: { isVerified: "false" } },
  { label: "Approved", value: "approved", filter: { isVerified: "true" } },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<string>("all");
  const filterParam = statusMap.find((f) => f.value === filter)?.filter;
  const { data: reviewsData, isLoading } = useReviews(filterParam);
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();

  const reviews = reviewsData?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-sm text-muted">Approve or remove property reviews</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Reviews" value={reviews.length} icon={Star} />
        <StatCard title="Approved" value={reviews.filter((r) => r.isVerified).length} icon={Check} />
        <StatCard title="Pending" value={reviews.filter((r) => !r.isVerified).length} icon={MoreHorizontal} />
      </div>

      <div className="mb-4 flex gap-2">
        {statusMap.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`rounded-lg px-4 py-1.5 text-xs transition ${
              filter === s.value
                ? "bg-brand text-white"
                : "border border-border hover:bg-neutral-100 dark:hover:bg-surface"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No reviews to moderate.</p>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <div key={review._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Property Review</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.isVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>
                        {review.isVerified ? "approved" : "pending"}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-warning fill-[#F59E0B]" : "text-border"}`} />
                        ))}
                      </div>
                      <span>|</span>
                      <span>{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                    {review.comment && <p className="mt-1 text-sm text-muted">{review.comment}</p>}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!review.isVerified && (
                      <>
                        <button
                          onClick={() => approveReview.mutate(review._id)}
                          disabled={approveReview.isPending}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-success/30 text-success transition hover:bg-success/5"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReview.mutate(review._id)}
                          disabled={deleteReview.isPending}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/5"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {review.isVerified && (
                      <button
                        onClick={() => deleteReview.mutate(review._id)}
                        disabled={deleteReview.isPending}
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
