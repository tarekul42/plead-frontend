import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface shadow-sm">
      <Skeleton className="aspect-[4/3] rounded-t-card rounded-b-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}
