"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeads } from "@/lib/queries/use-leads";
import { Plus, LayoutList, Columns3, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

const statusColors: Record<string, string> = {
  new: "bg-brand/10 text-brand",
  contacted: "bg-warning/10 text-warning",
  qualified: "bg-brand-light/10 text-brand-light",
  won: "bg-success/10 text-success",
  lost: "bg-danger/10 text-danger",
};

const statuses = ["new", "contacted", "qualified", "won", "lost"];

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const { data: leadsData, isLoading } = useLeads({ q: search || undefined });

  const leads = leadsData?.data || [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted">{leads.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-48 rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand"
            />
          </div>
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1 px-3 py-2 text-xs transition ${view === "table" ? "bg-brand/5 text-brand" : "text-muted hover:text-foreground"}`}
            >
              <LayoutList className="h-4 w-4" />
              Table
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1 border-l border-border px-3 py-2 text-xs transition ${view === "kanban" ? "bg-brand/5 text-brand" : "text-muted hover:text-foreground"}`}
            >
              <Columns3 className="h-4 w-4" />
              Kanban
            </button>
          </div>
          <Link href="#" className={buttonVariants()}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
      </div>

      {view === "table" ? (
        <div className="rounded-card border border-border bg-surface shadow-sm">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No leads found" message="Try adjusting your search or add a new lead." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Budget</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any) => (
                    <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50">
                      <td className="p-4">
                        <Link href={`/dashboard/leads/${lead._id}`} className="font-medium hover:text-brand">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="p-4 text-muted">{lead.email}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status] || "bg-neutral-100 text-muted"}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted">{lead.budget ? `$${(lead.budget / 1000).toFixed(0)}K` : "-"}</td>
                      <td className="p-4 text-muted">{lead.preferredLocation || "-"}</td>
                      <td className="p-4 text-muted">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {statuses.map((status) => {
            const statusLeads = leads.filter((l: any) => l.status === status);
            return (
              <div key={status} className="rounded-card border border-border bg-surface p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{status}</span>
                  <span className="text-xs text-muted">{statusLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {statusLeads.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted">No leads</p>
                  ) : (
                    statusLeads.map((lead: any) => (
                      <Link
                        key={lead._id}
                        href={`/dashboard/leads/${lead._id}`}
                        className="block rounded-lg border border-border bg-background p-3 text-sm transition hover:shadow-sm"
                      >
                        <p className="font-medium">{lead.name}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {lead.budget ? `$${(lead.budget / 1000).toFixed(0)}K` : "No budget"}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
