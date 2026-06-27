"use client";

import { useInteractions } from "@/lib/queries/use-interactions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Interaction } from "@/types/models";

interface InteractionTimelineProps {
  leadId: string;
}

export function InteractionTimeline({ leadId }: InteractionTimelineProps) {
  const { data, isLoading, isError } = useInteractions();

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        Loading timeline...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-sm text-danger">
        Failed to load timeline
      </div>
    );
  }

  const interactions: Interaction[] = data?.data ?? [];
  const filtered = interactions
    .filter((i) => i.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filtered.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        No interactions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        {filtered.length} interaction{filtered.length === 1 ? "" : "s"}
      </p>
      <div className="space-y-2">
        {filtered.map((interaction) => (
          <div
            key={interaction._id}
            className="relative rounded-card border border-border bg-surface p-4 pl-6"
          >
            <div className="absolute left-2.5 top-6 h-4 w-3">
              <span className="block h-2 w-2 rounded-full bg-brand" />
              <span className="absolute -bottom-8 left-1 block h-8 w-px bg-border" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="brand">{interaction.type}</Badge>
              {interaction.outcome && (
                <span className="text-xs capitalize text-muted">
                  {interaction.outcome}
                </span>
              )}
              <span className="ml-auto text-xs text-muted">
                {formatDate(interaction.createdAt)}
              </span>
            </div>
            {interaction.notes && (
              <p className="text-sm leading-relaxed text-muted">
                {interaction.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
