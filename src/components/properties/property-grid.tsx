import { PropertyCard } from "./property-card";
import { PropertySkeleton } from "./property-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import type { Property } from "@/types";

interface PropertyGridProps {
  properties?: Property[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export function PropertyGrid({ properties, isLoading, isError, onRetry }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-4 text-muted">Failed to load properties</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-brand px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <EmptyState
        title="No properties found"
        message="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
