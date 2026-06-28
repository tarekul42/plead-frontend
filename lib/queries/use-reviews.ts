"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { Review } from "@/types";

export function useReviews(params?: Record<string, unknown>) {
  return useQuery<ApiResponse<Review[]>>({
    queryKey: ["reviews", params ? JSON.stringify(params) : undefined],
    queryFn: () => reviewsApi.list(params),
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.update(id, { isVerified: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
