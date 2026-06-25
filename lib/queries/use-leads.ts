"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api-client";

export function useLeads(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => leadsApi.list(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.get(id),
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
