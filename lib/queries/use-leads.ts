"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/types";
import type { Lead, LeadListParams } from "@/types";

type PaginatedLeads = { data: Lead[]; meta?: PaginationMeta };

export function useLeads(params?: LeadListParams) {
  return useQuery({
    queryKey: ["leads", params ? JSON.stringify(params) : undefined],
    queryFn: () => leadsApi.list(params) as Promise<PaginatedLeads>,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.get(id) as Promise<Lead>,
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => leadsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLead(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => leadsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead"] });
    },
  });
}
