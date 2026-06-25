"use client";

import { useState } from "react";
import { Phone, Mail, Calendar, MessageSquare, Home, MoreHorizontal } from "lucide-react";

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  sms: MessageSquare,
  property_viewing: Home,
};

const interactionTypes = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "sms", label: "SMS" },
  { value: "property_viewing", label: "Viewing" },
];

const sampleInteractions = [
  { id: "1", leadName: "Sarah Johnson", type: "call", notes: "Discussed property options in Brooklyn.", outcome: "interested", createdAt: "2026-06-25" },
  { id: "2", leadName: "Mark Thompson", type: "email", notes: "Sent listing details for 3 properties.", outcome: "follow-up scheduled", createdAt: "2026-06-24" },
  { id: "3", leadName: "Emily Rodriguez", type: "meeting", notes: "In-person walkthrough of luxury condo.", outcome: "interested", createdAt: "2026-06-23" },
];

export default function InteractionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [interactions] = useState(sampleInteractions);

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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                  {interactionTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Outcome</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                  <option value="interested">Interested</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="follow-up">Follow-up Scheduled</option>
                  <option value="no_answer">No Answer</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <textarea
                rows={3}
                placeholder="Describe the interaction..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand resize-y"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Save Interaction
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {interactions.map((interaction) => {
          const Icon = typeIcons[interaction.type] || MoreHorizontal;
          return (
            <div key={interaction.id} className="rounded-card border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{interaction.leadName}</p>
                    <span className="text-xs text-muted">{interaction.createdAt}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-brand/5 px-2 py-0.5 text-xs capitalize text-brand">
                      {interaction.type}
                    </span>
                    <span className="text-xs text-muted capitalize">{interaction.outcome}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{interaction.notes}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
