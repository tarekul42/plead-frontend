"use client";

import { useState } from "react";
import { useInteractions, useCreateInteraction } from "@/lib/queries/use-interactions";
import { useLeads } from "@/lib/queries/use-leads";
import { Phone, Mail, Calendar, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
  tour: Home,
  other: MoreHorizontal,
};

const interactionTypes = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
  { value: "tour", label: "Tour" },
  { value: "other", label: "Other" },
];

const interactionSchema = z.object({
  leadId: z.string().min(1, "Please select a lead"),
  type: z.string().min(1),
  outcome: z.string().optional(),
  notes: z.string().optional(),
});

type InteractionFormValues = z.infer<typeof interactionSchema>;

export default function InteractionsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: interactionsData, isLoading } = useInteractions();
  const { data: leadsData } = useLeads();

  const interactions = interactionsData?.data || [];
  const leads = leadsData?.data || [];
  const leadNames = new Map(leads.map((l: any) => [l._id, l.name]));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetForm,
    watch,
  } = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionSchema) as never,
    defaultValues: { leadId: "", type: "call", outcome: "", notes: "" },
  });

  const selectedLeadId = watch("leadId");
  const createInteraction = useCreateInteraction(selectedLeadId);

  const onSubmit = (data: InteractionFormValues) => {
    createInteraction.mutate(
      { type: data.type, outcome: data.outcome || undefined, notes: data.notes || undefined },
      {
        onSuccess: () => {
          setShowForm(false);
          resetForm();
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interactions</h1>
          <p className="text-sm text-muted">Log and track touchpoints with leads</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"}>
          {showForm ? "Cancel" : "Log Interaction"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">New Interaction</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Lead" error={errors.leadId} htmlFor="leadId" required>
                <Select id="leadId" {...register("leadId")}>
                  <option value="">Select a lead...</option>
                  {leads.map((lead: any) => (
                    <option key={lead._id} value={lead._id}>{lead.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Type" error={errors.type} htmlFor="type" required>
                <Select id="type" {...register("type")}>
                  {interactionTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Outcome" error={errors.outcome} htmlFor="outcome">
                <Input id="outcome" placeholder="e.g. interested, follow-up" {...register("outcome")} />
              </FormField>
            </div>
            <FormField label="Notes" error={errors.notes} htmlFor="notes">
              <Textarea id="notes" rows={3} placeholder="Describe the interaction..." {...register("notes")} />
            </FormField>
            <Button type="submit" disabled={isSubmitting || !selectedLeadId}>
              {isSubmitting ? "Saving..." : "Save Interaction"}
            </Button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
      ) : interactions.length === 0 ? (
        <div className="py-12">
          <EmptyState title="No interactions logged" message="Start logging interactions with your leads." />
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction: any) => {
            const Icon = typeIcons[interaction.type] || MoreHorizontal;
            return (
              <div key={interaction._id} className="rounded-card border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{leadNames.get(interaction.leadId) || interaction.leadId?.slice(-6)}</p>
                      <span className="text-xs text-muted">{new Date(interaction.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-brand/5 px-2 py-0.5 text-xs capitalize text-brand">
                        {interaction.type}
                      </span>
                      {interaction.outcome && (
                        <span className="text-xs text-muted capitalize">{interaction.outcome}</span>
                      )}
                    </div>
                    {interaction.notes && <p className="mt-2 text-sm text-muted">{interaction.notes}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
