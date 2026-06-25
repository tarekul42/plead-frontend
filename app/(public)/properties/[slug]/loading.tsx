export default function LoadingDetail() {
  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
        <div className="h-4 w-4 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
        <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-neutral-200 dark:bg-[#1E293B]" />
        </div>
        <div>
          <div className="rounded-card border border-border bg-surface p-6">
            <div className="mb-4 h-8 w-32 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
