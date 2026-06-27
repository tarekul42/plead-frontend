import { PackageOpen, FileX2, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  variant?: "default" | "search" | "error";
}

const variantIcons = {
  default: PackageOpen,
  search: SearchX,
  error: FileX2,
};

export function EmptyState({
  title = "Nothing here yet",
  message = "Try adjusting your filters or check back later.",
  action,
  variant = "default",
}: EmptyStateProps) {
  const Icon = variantIcons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={cn(
        "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
        variant === "error" ? "bg-danger/10" : "bg-brand/5",
      )}>
        <Icon className={cn(
          "h-7 w-7",
          variant === "error" ? "text-danger" : "text-muted",
        )} />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted">{message}</p>
      {action}
    </div>
  );
}
