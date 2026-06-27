"use client";

import { useInteractions } from "@/lib/queries/use-interactions";
import type { Interaction } from "@/types/models";

interface InteractionTimelineProps {
  leadId: string;
}

const typeStyles: Record<string, string> = {
  call: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  email: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  meeting: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const outcomeStyles: Record<string, string> = {
  positive: "text-green-600 dark:text-green-400",
  neutral: "text-yellow-600 dark:text-yellow-400",
  negative: "text-red-600 dark:text-red-400",
};

export function InteractionTimeline({ leadId }: InteractionTimelineProps) {
  const { data, isLoading, isError } = useInteractions();

  if (isLoading) return <div data-testid="loading" className="py-8 text-center text-sm text-muted">Loading timeline...</div>;
  if (isError) return <div data-testid="error" className="py-8 text-center text-sm text-danger">Failed to load timeline</div>;

  const interactions: Interaction[] = data?.data ?? [];

  if (interactions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        No interactions recorded yet
      </div>
    );
  }

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filtered = sorted.filter((i) => i.leadId === leadId);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div data-testid="interaction-timeline" className="space-y-3">
      <p data-testid="interaction-count" className="text-xs text-muted">
        {filtered.length} interactions
      </p>
      <div data-testid="timeline-entries" className="space-y-2">
        {filtered.map((interaction) => (
          <div
            key={interaction._id}
            className="rounded-card border border-border bg-surface p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyles[interaction.type] || ""}`}>
                {interaction.type}
              </span>
              <span className={`text-xs ${outcomeStyles[interaction.outcome as string] || ""}`}>
                {interaction.outcome}
              </span>
            </div>
            <p className="text-sm text-muted">{interaction.notes}</p>
            <p className="mt-1 text-xs text-muted">{formatDate(interaction.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
