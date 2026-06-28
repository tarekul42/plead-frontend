"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/types";
import type { Property, PropertyListParams } from "@/types";

type PaginatedProperties = { data: Property[]; meta?: PaginationMeta };

export function useProperties(params?: PropertyListParams) {
  const hasFilters = params && (params.q || params.propertyType || params.priceMin || params.priceMax || params.beds || params.status || params.location);
  return useQuery({
    queryKey: ["properties", params ? JSON.stringify(params) : undefined],
    queryFn: () => propertiesApi.list(params) as Promise<PaginatedProperties>,
    staleTime: hasFilters ? 0 : 60 * 1000,
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: () => propertiesApi.get(slug) as Promise<Property>,
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
