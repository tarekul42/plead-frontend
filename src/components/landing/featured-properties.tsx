"use client";

import Link from "next/link";
import { useProperties } from "@/lib/queries/use-properties";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertySkeleton } from "@/components/properties/property-skeleton";
import { ErrorState } from "@/components/common/error-state";

export function FeaturedProperties() {
  const { data, isLoading, isError, refetch } = useProperties({
    limit: 4,
    sort: "-createdAt",
    status: "available",
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Properties</h2>
            <p className="mt-2 text-muted">Handpicked listings for you</p>
          </div>
          <Link href="/properties" className="text-sm text-brand hover:underline">
            View all
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        )}

        {isError && <ErrorState message="Failed to load properties" onRetry={() => refetch()} />}

        {data?.data && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.data.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
