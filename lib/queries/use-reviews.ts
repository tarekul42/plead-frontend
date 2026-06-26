"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Review } from "@/types/models";

export function useReviews(params?: Record<string, unknown>) {
  return useQuery<ApiResponse<Review[]>>({
    queryKey: ["reviews", params],
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
