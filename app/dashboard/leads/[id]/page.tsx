"use client";

import { use } from "react";
import { useLead } from "@/lib/queries/use-leads";
import { AiMatchPanel } from "@/components/ai/ai-match-panel";
import { ErrorState } from "@/components/common/error-state";
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Home, Bed, Bath } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: leadData, isLoading, isError, refetch } = useLead(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-surface" />
        <div className="h-32 animate-pulse rounded-card bg-neutral-200 dark:bg-surface" />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load lead" onRetry={() => refetch()} />;

  const lead = leadData?.data;
  if (!lead) return <ErrorState message="Lead not found" />;

  return (
    <div>
      <Link href="/dashboard/leads" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{lead.name}</h1>
                <p className="text-sm text-muted">{lead.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                lead.status === "new" ? "bg-brand/10 text-brand" :
                lead.status === "contacted" ? "bg-warning/10 text-warning" :
                lead.status === "qualified" ? "bg-brand-light/10 text-brand-light" :
                lead.status === "won" ? "bg-success/10 text-success" :
                "bg-danger/10 text-danger"
              }`}>
                {lead.status}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Mail, label: "Email", value: lead.email },
                { icon: Phone, label: "Phone", value: lead.phone || "-" },
                { icon: MapPin, label: "Location", value: lead.preferredLocation || "-" },
                { icon: DollarSign, label: "Budget", value: lead.budget ? `$${(lead.budget / 1000).toFixed(0)}K` : "-" },
                { icon: Home, label: "Type", value: lead.propertyType || "-" },
                { icon: Bed, label: "Beds", value: lead.bedsDesired || "-" },
                { icon: Bath, label: "Baths", value: lead.bathsDesired || "-" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <item.icon className="h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {lead.notes && (
              <div className="mt-6">
                <p className="mb-1 text-xs text-muted">Notes</p>
                <p className="text-sm">{lead.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AiMatchPanel leadId={id} />
          <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/interactions"
                className="flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
              >
                Log Interaction
              </Link>
              <button className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm text-white transition hover:opacity-90">
                Generate Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
