import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface VisualCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "brand" | "success" | "warning";
  className?: string;
}

const gradientStyles = {
  brand: "from-brand/10 to-brand/5",
  success: "from-brand/15 to-brand/5",
  warning: "from-brand/8 to-brand/3",
};

const iconStyles = {
  brand: "text-brand",
  success: "text-brand",
  warning: "text-brand",
};

export function VisualCard({
  icon: Icon,
  title,
  description,
  gradient = "brand",
  className,
}: VisualCardProps) {
  return (
    <div className={cn("glow-card rounded-card border border-border bg-surface p-8", className)}>
      <div
        className={cn(
          "mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br",
          gradientStyles[gradient],
        )}
      >
        <Icon className={cn("h-7 w-7", iconStyles[gradient])} />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
