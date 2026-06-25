import { PropertySkeleton } from "@/components/properties/property-skeleton";

export default function LoadingExplore() {
  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
