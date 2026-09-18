import { CheckCircle2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProofBadgeProps {
  icon?: LucideIcon;
  text: string;
  variant?: "default" | "success" | "brand";
  className?: string;
}

const variantStyles = {
  default: "bg-surface text-muted border-border",
  success: "bg-success/5 text-success border-success/20",
  brand: "bg-brand/5 text-brand border-brand/20",
};

export function ProofBadge({
  icon: Icon = CheckCircle2,
  text,
  variant = "default",
  className,
}: ProofBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}
