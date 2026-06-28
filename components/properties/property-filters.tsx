"use client";

import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants";

interface Filters {
  propertyType?: string;
  status?: string;
  bedsMin?: number;
  bathsMin?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const update = (key: keyof Filters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Sort by</label>
        <select
          value={filters.sort || "newest"}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="-views">Most Viewed</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() =>
                update("propertyType", filters.propertyType === type ? undefined : type)
              }
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                filters.propertyType === type
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:bg-neutral-100 dark:hover:bg-surface"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Status</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() =>
                update("status", filters.status === status ? undefined : status)
              }
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                filters.status === status
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:bg-neutral-100 dark:hover:bg-surface"
              }`}
            >
              {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Min. Bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => update("bedsMin", filters.bedsMin === n ? undefined : n)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition ${
                filters.bedsMin === n
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:bg-neutral-100 dark:hover:bg-surface"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Min. Bathrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => update("bathsMin", filters.bathsMin === n ? undefined : n)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition ${
                filters.bathsMin === n
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:bg-neutral-100 dark:hover:bg-surface"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ""}
            onChange={(e) => update("priceMin", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ""}
            onChange={(e) => update("priceMax", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({
          propertyType: undefined,
          status: undefined,
          bedsMin: undefined,
          bathsMin: undefined,
          priceMin: undefined,
          priceMax: undefined,
          sort: undefined,
        })}
        className="w-full rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
      >
        Clear filters
      </button>
    </div>
  );
}
