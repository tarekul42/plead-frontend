"use client";

import { use } from "react";
import Link from "next/link";
import { useLead } from "@/lib/queries/use-leads";
import { AiMatchPanel } from "@/components/ai/ai-match-panel";
import { InteractionTimeline } from "@/components/interactions/interaction-timeline";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants";
import { formatCompactPrice, formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Home, Bed, Bath, Calendar, MessageSquare } from "lucide-react";

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
      <Link
        href="/dashboard/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <PageHeader
        title={lead.name}
        description={`${lead.email} &bull; Created ${lead.createdAt ? formatDate(lead.createdAt) : "Unknown"}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{lead.name}</h2>
                  <p className="text-sm text-muted">{lead.email}</p>
                </div>
                <Badge variant={(LEAD_STATUS_COLORS as any)[lead.status] as any || "default"}>
                  {LEAD_STATUS_LABELS[lead.status as keyof typeof LEAD_STATUS_LABELS] || lead.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: Mail, label: "Email", value: lead.email },
                  { icon: Phone, label: "Phone", value: lead.phone || "-" },
                  { icon: MapPin, label: "Location", value: lead.preferredLocation || "-" },
                  { icon: DollarSign, label: "Budget", value: lead.budget ? formatCompactPrice(lead.budget) : "-" },
                  { icon: Home, label: "Type", value: lead.propertyType || "-" },
                  { icon: Bed, label: "Beds", value: lead.bedsDesired || "-" },
                  { icon: Bath, label: "Baths", value: lead.bathsDesired || "-" },
                  { icon: Calendar, label: "Created", value: lead.createdAt ? formatDate(lead.createdAt) : "-" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-border bg-background p-3">
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
                  <p className="mb-1.5 text-xs font-medium text-muted">Notes</p>
                  <p className="text-sm leading-relaxed">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Interaction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InteractionTimeline leadId={id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="h-4 w-4" />}>
                Log Interaction
              </Button>
              <Button className="w-full justify-start" leftIcon={<Mail className="h-4 w-4" />}>
                Generate Email
              </Button>
            </CardContent>
          </Card>

          <AiMatchPanel leadId={id} />
        </div>
      </div>
    </div>
  );
}
