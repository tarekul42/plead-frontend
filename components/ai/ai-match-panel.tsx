"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/lib/api-client";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface AiMatchPanelProps {
  leadId: string;
}

export function AiMatchPanel({ leadId }: AiMatchPanelProps) {
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<{ matches: { propertyTitle: string; propertyLocation: string; score: number; reasons: string[] }[] }>({
    queryKey: ["ai-match", leadId],
    queryFn: () => aiApi.matchLeadProperties({ leadId }) as Promise<{ matches: { propertyTitle: string; propertyLocation: string; score: number; reasons: string[] }[] }>,
    enabled,
  });

  const handleMatch = () => {
    if (!enabled) {
      setEnabled(true);
    } else {
      refetch();
    }
  };

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-success" />
        <h3 className="text-sm font-semibold">AI Match Engine</h3>
      </div>

      {!enabled ? (
        <button
          onClick={handleMatch}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Match Properties
        </button>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing matches...
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-danger/5 p-4 text-sm">
          <div className="flex items-center gap-2 text-danger mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Match failed</span>
          </div>
          <p className="text-xs text-muted">AI service unavailable. Try again later.</p>
          <button onClick={handleMatch} className="mt-2 text-xs text-brand hover:underline">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.matches?.map((match: any, i: number) => (
            <div key={i} className="rounded-lg border border-border bg-background p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">{match.propertyTitle}</p>
                <span className={`text-xs font-bold ${
                  match.score >= 80 ? "text-success" : match.score >= 60 ? "text-warning" : "text-muted"
                }`}>
                  {match.score}%
                </span>
              </div>
              <p className="mb-2 text-xs text-muted">{match.propertyLocation}</p>
              {match.reasons?.length > 0 && (
                <ul className="space-y-0.5">
                  {match.reasons.map((r: string, j: number) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs text-muted">
                      <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {(!data?.matches || data.matches.length === 0) && (
            <p className="py-4 text-center text-xs text-muted">No matching properties found.</p>
          )}
          <button onClick={handleMatch} className="w-full text-xs text-brand hover:underline">
            Refresh matches
          </button>
        </div>
      )}
    </div>
  );
}
