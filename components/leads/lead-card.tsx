"use client";

import type { Lead } from "@/types/models";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  qualified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  negotiating: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function LeadCard({ lead, onView, onEdit, onDelete }: LeadCardProps) {
  const formatPrice = (p?: number) => {
    if (p === undefined || p === null) return "";
    return "$" + p.toLocaleString();
  };
  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <article className={`rounded-card border border-border bg-surface p-4 shadow-sm ${lead.status}`}>
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-medium">{lead.name}</h3>
          <p className="text-sm text-muted">{lead.email}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[lead.status] || ""}`}>
          {lead.status}
        </span>
      </div>
      {lead.phone && <p className="text-sm text-muted">{lead.phone}</p>}
      <p className="text-sm font-semibold text-brand">{formatPrice(lead.budget)}</p>
      {lead.preferredLocation && <p className="text-xs text-muted">{lead.preferredLocation}</p>}
      {lead.source && <p className="text-xs text-muted">{lead.source}</p>}
      <p className="mt-1 text-xs text-muted">{formatDate(lead.createdAt)}</p>
      <div className="mt-3 flex gap-2">
        {onView && (
          <button aria-label="View details" onClick={() => onView(lead)} className="flex items-center gap-1 text-xs text-brand hover:underline">
            <Eye className="h-3 w-3" /> View
          </button>
        )}
        {onEdit && (
          <button aria-label="Edit" onClick={() => onEdit(lead)} className="flex items-center gap-1 text-xs text-brand hover:underline">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
        {onDelete && (
          <button aria-label="Delete" onClick={() => onDelete(lead)} className="flex items-center gap-1 text-xs text-danger hover:underline">
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        )}
      </div>
    </article>
  );
}
