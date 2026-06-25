"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Property } from "@/types/models";

export function useProperties(params?: Record<string, unknown>) {
  return useQuery<ApiResponse<Property[]>>({
    queryKey: ["properties", params],
    queryFn: () => propertiesApi.list(params),
  });
}

export function useProperty(slug: string) {
  return useQuery<ApiResponse<Property>>({
    queryKey: ["property", slug],
    queryFn: () => propertiesApi.get(slug),
    enabled: !!slug,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => propertiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => propertiesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property"] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
