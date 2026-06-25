export function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-[#1E293B]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-card bg-neutral-200 dark:bg-[#1E293B]" />
        ))}
      </div>
      <div className="h-64 rounded-card bg-neutral-200 dark:bg-[#1E293B]" />
    </div>
  );
}
