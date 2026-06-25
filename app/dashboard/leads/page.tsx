"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeads } from "@/lib/queries/use-leads";
import { Plus, LayoutList, Columns3, Search } from "lucide-react";

const statusColors: Record<string, string> = {
  new: "bg-[#2563EB]/10 text-[#2563EB]",
  contacted: "bg-[#F59E0B]/10 text-[#F59E0B]",
  qualified: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  won: "bg-[#10B981]/10 text-[#10B981]",
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
              className="w-48 rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#2563EB]"
            />
          </div>
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1 px-3 py-2 text-xs transition ${view === "table" ? "bg-[#2563EB]/5 text-[#2563EB]" : "text-muted hover:text-foreground"}`}
            >
              <LayoutList className="h-4 w-4" />
              Table
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1 border-l border-border px-3 py-2 text-xs transition ${view === "kanban" ? "bg-[#2563EB]/5 text-[#2563EB]" : "text-muted hover:text-foreground"}`}
            >
              <Columns3 className="h-4 w-4" />
              Kanban
            </button>
          </div>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
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
                <div key={i} className="h-10 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">No leads found.</p>
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
                    <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-[#1E293B]/50">
                      <td className="p-4">
                        <Link href={`/dashboard/leads/${lead._id}`} className="font-medium hover:text-[#2563EB]">
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
