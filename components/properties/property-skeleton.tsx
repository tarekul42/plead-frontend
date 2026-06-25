export function PropertySkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-border bg-surface shadow-sm">
      <div className="aspect-[4/3] rounded-t-card bg-neutral-200 dark:bg-[#1E293B]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-[#1E293B]" />
        <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-[#1E293B]" />
        <div className="flex gap-4">
          <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-[#1E293B]" />
          <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-[#1E293B]" />
          <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-[#1E293B]" />
        </div>
        <div className="h-5 w-24 rounded bg-neutral-200 dark:bg-[#1E293B]" />
      </div>
    </div>
  );
}
