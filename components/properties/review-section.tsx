"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useReviews } from "@/lib/queries/use-reviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { reviewsApi } from "@/lib/api-client";

interface ReviewSectionProps {
  propertyId: string;
}

export function ReviewSection({ propertyId }: ReviewSectionProps) {
  const { isSignedIn } = useUser();
  const { data, isLoading } = useReviews({ propertyId });
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: (data: { propertyId: string; rating: number; title?: string; comment?: string }) =>
      reviewsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setShowForm(false);
      setTitle("");
      setComment("");
      setRating(5);
    },
  });

  const reviews = data?.data || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({ propertyId, rating, title, comment });
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="mt-1 text-muted">
            {reviews.length > 0
              ? `${avgRating.toFixed(1)} average rating from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
              : "No reviews yet"}
          </p>
        </div>
        {isSignedIn && !showForm && (
          <Button
            variant="secondary"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          n <= rating
                            ? "fill-warning text-warning"
                            : "text-neutral-300 dark:text-neutral-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Title" htmlFor="review-title">
                <Input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                />
              </FormField>
              <FormField label="Comment" htmlFor="review-comment" required>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this property..."
                  required
                />
              </FormField>
              <div className="flex gap-2">
                <Button type="submit" disabled={createReview.isPending || !comment}>
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-card border border-border bg-surface p-6">
              <div className="mb-3 h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mb-2 h-3 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          message="Be the first to review this property."
          action={
            isSignedIn ? (
              <Button variant="secondary" onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                      {review.userId?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {review.userId?.name || "Anonymous"}
                        {review.isVerified && (
                          <span className="ml-1.5 inline-flex items-center text-success">
                            <ThumbsUp className="h-3 w-3" />
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {review.createdAt ? formatDate(review.createdAt) : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-warning text-warning"
                            : "text-neutral-300 dark:text-neutral-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h4 className="mb-1 font-medium">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-sm leading-relaxed text-muted">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
