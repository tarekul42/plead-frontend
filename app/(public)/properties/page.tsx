"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProperties } from "@/lib/queries/use-properties";
import { PropertySearchBar } from "@/components/properties/property-search-bar";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyGrid } from "@/components/properties/property-grid";
import { Pagination } from "@/components/common/pagination";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);

  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      propertyType: searchParams.get("propertyType") || "",
      status: searchParams.get("status") || "",
      bedsMin: searchParams.get("bedsMin") ? Number(searchParams.get("bedsMin")) : undefined,
      bathsMin: searchParams.get("bathsMin") ? Number(searchParams.get("bathsMin")) : undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      sort: searchParams.get("sort") || "newest",
      page: Number(searchParams.get("page")) || 1,
      limit: 12,
    }),
    [searchParams],
  );

  const queryParams = useMemo(() => {
    const p: Record<string, unknown> = {
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
    };
    if (filters.q) p.q = filters.q;
    if (filters.propertyType) p.propertyType = filters.propertyType;
    if (filters.status) p.status = filters.status;
    if (filters.bedsMin) p.bedsMin = filters.bedsMin;
    if (filters.bathsMin) p.bathsMin = filters.bathsMin;
    if (filters.priceMin) p.priceMin = filters.priceMin;
    if (filters.priceMax) p.priceMax = filters.priceMax;
    return p;
  }, [filters]);

  const { data, isLoading, isError, refetch } = useProperties(queryParams);

  const updateFilters = useCallback(
    (updates: Record<string, unknown>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.page) params.set("page", String(updates.page));
      else params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams],
  );

  const totalPages = data?.meta ? Math.ceil(data.meta.total / filters.limit) : 1;

  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">Explore Properties</h1>
        <p className="text-muted">
          {data?.meta?.total
            ? `${data.meta.total} properties found`
            : "Find your perfect property"}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <PropertySearchBar
            value={filters.q}
            onChange={(q) => updateFilters({ q, page: 1 })}
          />
        </div>
        <button
          onClick={() => setMobileFilters(!mobileFilters)}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <PropertyFilters
            filters={filters}
            onChange={(f) =>
              updateFilters({ ...f, page: 1 } as Record<string, unknown>)
            }
          />
        </aside>

        {mobileFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-background p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-surface"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <PropertyFilters
                filters={filters}
                onChange={(f) => updateFilters({ ...f, page: 1 } as Record<string, unknown>)}
              />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <PropertyGrid
            properties={data?.data}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      </div>
    </div>
  );
}
