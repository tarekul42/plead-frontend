"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionsApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/types";
import type { Interaction } from "@/types";

type PaginatedInteractions = { data: Interaction[]; meta?: PaginationMeta };

export function useInteractions() {
  return useQuery({
    queryKey: ["interactions"],
    queryFn: () => interactionsApi.list() as Promise<PaginatedInteractions>,
  });
}

export function useCreateInteraction(leadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => interactionsApi.create(leadId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
    },
  });
}
