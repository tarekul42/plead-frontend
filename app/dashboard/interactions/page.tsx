"use client";

import { useState } from "react";
import { useInteractions, useCreateInteraction } from "@/lib/queries/use-interactions";
import { useLeads } from "@/lib/queries/use-leads";
import { Phone, Mail, Calendar, Home, MessageSquare, MoreHorizontal, Loader2 } from "lucide-react";

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

export default function InteractionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("call");
  const [formLeadId, setFormLeadId] = useState("");
  const [formOutcome, setFormOutcome] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const { data: interactionsData, isLoading } = useInteractions();
  const { data: leadsData } = useLeads();
  const createInteraction = useCreateInteraction(formLeadId);

  const interactions = interactionsData?.data || [];
  const leads = leadsData?.data || [];
  const leadNames = new Map(leads.map((l: any) => [l._id, l.name]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLeadId) return;
    createInteraction.mutate(
      { type: formType, outcome: formOutcome || undefined, notes: formNotes || undefined },
      { onSuccess: () => { setShowForm(false); setFormLeadId(""); setFormType("call"); setFormOutcome(""); setFormNotes(""); } },
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interactions</h1>
          <p className="text-sm text-muted">Log and track touchpoints with leads</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          {showForm ? "Cancel" : "Log Interaction"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">New Interaction</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Lead</label>
                <select
                  value={formLeadId}
                  onChange={(e) => setFormLeadId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a lead...</option>
                  {leads.map((lead: any) => (
                    <option key={lead._id} value={lead._id}>{lead.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  {interactionTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Outcome</label>
                <input
                  value={formOutcome}
                  onChange={(e) => setFormOutcome(e.target.value)}
                  placeholder="e.g. interested, follow-up"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={3}
                placeholder="Describe the interaction..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={createInteraction.isPending || !formLeadId}
              className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {createInteraction.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {createInteraction.isPending ? "Saving..." : "Save Interaction"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">No interactions logged yet.</p>
          ) : (
            interactions.map((interaction) => {
              const Icon = typeIcons[interaction.type] || MoreHorizontal;
              return (
                <div key={interaction._id} className="rounded-card border border-border bg-surface p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{leadNames.get(interaction.leadId) || interaction.leadId.slice(-6)}</p>
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
            })
          )}
        </div>
      )}
    </div>
  );
}
