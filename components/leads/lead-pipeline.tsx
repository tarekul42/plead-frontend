"use client";

import { useState } from "react";
import { useLeads } from "@/lib/queries/use-leads";
import type { Lead } from "@/types/models";

const COLUMNS = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "won", label: "Won" },
];

interface LeadPipelineProps {
  onLeadClick?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: string) => void;
}

export function LeadPipeline({ onLeadClick, onStatusChange }: LeadPipelineProps) {
  const { data, isLoading, isError } = useLeads();
  const [search, setSearch] = useState("");

  if (isLoading) return <div className="py-8 text-center text-sm text-muted">Loading...</div>;
  if (isError) return <div className="py-8 text-center text-sm text-danger">Error: Failed to load</div>;

  const leads: Lead[] = data?.data ?? [];
  const filtered = search
    ? leads.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
    : leads;

  const getLeadsByStatus = (status: string) => filtered.filter((l) => l.status === status);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer?.setData("text/plain", lead._id);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer?.getData("text/plain");
    if (leadId) onStatusChange?.(leadId, newStatus);
  };

  if (leads.length === 0 && !search) {
    return <div className="py-8 text-center text-sm text-muted">No leads yet</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search leads..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const columnLeads = getLeadsByStatus(col.key);
          return (
            <div
              key={col.key}
              data-status={col.key}
              className="column rounded-card border border-border bg-surface p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-muted">{columnLeads.length}</span>
              </div>
              {columnLeads.length === 0 && (
                <p className="py-4 text-center text-xs text-muted">No leads</p>
              )}
              <div className="space-y-2">
                {columnLeads.map((lead) => (
                  <div
                    key={lead._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => onLeadClick?.(lead)}
                    className="cursor-pointer rounded-lg bg-background p-2 text-sm shadow-sm transition hover:shadow-md"
                  >
                    <p className="font-medium">{lead.name}</p>
                    {lead.budget !== undefined && (
                      <p className="text-xs text-muted">${lead.budget.toLocaleString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
