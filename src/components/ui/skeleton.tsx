import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-neutral-200 dark:bg-neutral-800",
        className,
      )}
      aria-hidden="true"
    />
  );
}
