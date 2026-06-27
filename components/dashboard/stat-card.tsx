import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: "brand" | "success" | "warning" | "danger";
  trend?: { value: string; positive: boolean };
  sparkline?: { values: number[] };
}

const colorMap = {
  brand: { bg: "bg-brand/10", icon: "text-brand" },
  success: { bg: "bg-success/10", icon: "text-success" },
  warning: { bg: "bg-warning/10", icon: "text-warning" },
  danger: { bg: "bg-danger/10", icon: "text-danger" },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "brand",
  trend,
  sparkline,
}: StatCardProps) {
  return (
    <div className="relative rounded-card border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-muted">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                trend.positive ? "text-success" : "text-danger",
              )}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colorMap[color].bg)}>
          <Icon className={cn("h-5 w-5", colorMap[color].icon)} />
        </div>
      </div>
      {sparkline && (
        <div className="mt-4 h-8">
          <svg viewBox={`0 0 ${sparkline.values.length * 10} 40`} className="h-full w-full">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn("opacity-30", colorMap[color].icon)}
              points={sparkline.values
                .map((v, i) => `${i * 10},${40 - (v / Math.max(...sparkline.values)) * 35}`)
                .join(" ")}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
