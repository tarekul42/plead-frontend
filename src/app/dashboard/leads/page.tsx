"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeads } from "@/lib/queries/use-leads";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants";
import { formatCompactPrice, formatDate } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Plus,
  LayoutList,
  Columns3,
  Search,
} from "lucide-react";

function LeadsTable({ leads }: { leads: any[] }) {
  return (
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
            <tr
              key={lead._id}
              className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50"
            >
              <td className="p-4">
                <Link
                  href={`/dashboard/leads/${lead._id}`}
                  className="font-medium hover:text-brand"
                >
                  {lead.name}
                </Link>
              </td>
              <td className="p-4 text-muted">{lead.email}</td>
              <td className="p-4">
                <Badge variant={(LEAD_STATUS_COLORS as any)[lead.status] as any || "default"}>
                  {LEAD_STATUS_LABELS[lead.status as keyof typeof LEAD_STATUS_LABELS] || lead.status}
                </Badge>
              </td>
              <td className="p-4 text-muted">
                {lead.budget ? formatCompactPrice(lead.budget) : "-"}
              </td>
              <td className="p-4 text-muted">{lead.preferredLocation || "-"}</td>
              <td className="p-4 text-muted">
                {lead.createdAt ? formatDate(lead.createdAt) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadsKanban({ leads }: { leads: any[] }) {
  const statuses = ["new", "contacted", "qualified", "negotiating", "closed", "lost"];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statuses.map((status) => {
        const statusLeads = leads.filter((l: any) => l.status === status);
        return (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium capitalize">
                {status}
                <span className="text-xs text-muted">{statusLeads.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {statusLeads.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">No leads</p>
              ) : (
                statusLeads.map((lead: any) => (
                  <Link
                    key={lead._id}
                    href={`/dashboard/leads/${lead._id}`}
                    className="block rounded-lg border border-border bg-background p-3 text-sm transition hover:shadow-sm"
                  >
                    <p className="font-medium">{lead.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {lead.budget ? formatCompactPrice(lead.budget) : "No budget"}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const debouncedSearch = useDebounce(search, 300);

  const params = {
    q: debouncedSearch || undefined,
    status: statusFilter || undefined,
    page,
    limit,
  };

  const { data: leadsData, isLoading } = useLeads(params);
  const leads = leadsData?.data || [];
  const total = leadsData?.meta?.total || 0;
  const totalPages = leadsData?.meta ? Math.ceil(leadsData.meta.total / limit) : 1;

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${total} total ${total === 1 ? "lead" : "leads"}`}
        action={
          <Link href="/dashboard/leads/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Lead
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition ${
              view === "table"
                ? "bg-brand text-white"
                : "text-muted hover:bg-neutral-100 dark:hover:bg-surface-alt"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Table
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition ${
              view === "kanban"
                ? "bg-brand text-white"
                : "text-muted hover:bg-neutral-100 dark:hover:bg-surface-alt"
            }`}
          >
            <Columns3 className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No leads found"
              message="Try adjusting your search or add a new lead."
            />
          </div>
        ) : view === "table" ? (
          <>
            <LeadsTable leads={leads} />
            <div className="border-t border-border px-4 py-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                total={total}
                pageSize={limit}
              />
            </div>
          </>
        ) : (
          <CardContent>
            <LeadsKanban leads={leads} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
