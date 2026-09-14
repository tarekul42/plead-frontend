"use client";

import type { Lead } from "@/types";
import { Eye, Pencil, Trash2, Phone, MapPin, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

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

  return (
    <article
      className={cn(
        "group rounded-card border border-border bg-surface p-6 shadow-sm transition hover:shadow-md",
        lead.status,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
            {lead.name}
          </h3>
          <p className="truncate text-sm text-muted">{lead.email}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusStyles[lead.status] || "bg-neutral-100 text-muted",
          )}
        >
          {lead.status}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-brand">
        {formatPrice(lead.budget)}
      </p>

      <div className="mt-4 space-y-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {lead.phone && (
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Phone className="h-3 w-3" />
            {lead.phone}
          </p>
        )}
        {lead.preferredLocation && (
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3 w-3" />
            {lead.preferredLocation}
          </p>
        )}
        {lead.source && (
          <p className="flex items-center gap-1.5 text-xs text-muted">{lead.source}</p>
        )}
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar className="h-3 w-3" />
          {formatDate(lead.createdAt)}
        </p>
      </div>

      {(onView || onEdit || onDelete) && (
        <div className="mt-4 flex gap-1 border-t border-border pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {onView && (
            <button
              aria-label="View details"
              onClick={() => onView(lead)}
              className="rounded-md p-1.5 text-muted transition hover:bg-neutral-100 hover:text-brand dark:hover:bg-neutral-800"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              aria-label="Edit"
              onClick={() => onEdit(lead)}
              className="rounded-md p-1.5 text-muted transition hover:bg-neutral-100 hover:text-brand dark:hover:bg-neutral-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              aria-label="Delete"
              onClick={() => onDelete(lead)}
              className="rounded-md p-1.5 text-muted transition hover:bg-neutral-100 hover:text-danger dark:hover:bg-neutral-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
