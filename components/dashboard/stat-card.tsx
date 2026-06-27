import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {description && <p className="mt-1 text-xs text-muted">{description}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.positive ? "text-success" : "text-danger"}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
          <Icon className="h-5 w-5 text-brand" />
        </div>
      </div>
    </div>
  );
}
