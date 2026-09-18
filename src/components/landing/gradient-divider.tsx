import { cn } from "@/lib/utils";

interface GradientDividerProps {
  className?: string;
}

export function GradientDivider({ className }: GradientDividerProps) {
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-brand/30 to-transparent",
        className,
      )}
    />
  );
}
