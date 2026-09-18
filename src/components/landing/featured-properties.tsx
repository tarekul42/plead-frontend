"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ErrorState } from "@/components/common/error-state";
import { SectionHeader } from "@/components/landing/section-header";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertySkeleton } from "@/components/properties/property-skeleton";
import { useProperties } from "@/lib/queries/use-properties";
import type { Property } from "@/types";

const FILTERS = [
  { label: "All", value: undefined },
  { label: "Houses", value: "house" },
  { label: "Apartments", value: "apartment" },
  { label: "Condos", value: "condo" },
];

export function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, refetch } = useProperties({
    limit: 6,
    sort: "-createdAt",
    status: "available",
    propertyType: activeFilter,
  });

  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Featured listings"
            title="Properties you'll love"
            subtitle="Handpicked listings updated daily."
            align="left"
            className="mb-0"
          />
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeFilter === f.value
                  ? "bg-brand text-white"
                  : "border border-border bg-background text-muted hover:border-brand/30 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        )}

        {isError && <ErrorState message="Failed to load properties" onRetry={() => refetch()} />}

        {data?.data && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((property: Property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
