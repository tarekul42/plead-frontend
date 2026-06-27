"use client";

import { useState } from "react";

interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  budget?: number;
  preferredLocation?: string;
  notes?: string;
  status?: string;
  source?: string;
  assignedAgentId: string;
}

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void | Promise<void>;
  initialData?: Partial<LeadFormData>;
}

const STATUS_OPTIONS = ["new", "contacted", "qualified", "negotiating", "closed", "lost"];
const SOURCE_OPTIONS = ["website", "referral", "call", "email", "walk-in", "other"];

export function LeadForm({ onSubmit, initialData }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    budget: initialData?.budget || undefined,
    preferredLocation: initialData?.preferredLocation || "",
    notes: initialData?.notes || "",
    status: initialData?.status || "new",
    source: initialData?.source || "website",
    assignedAgentId: initialData?.assignedAgentId || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.includes("@") || !form.email.includes(".")) errs.email = "Invalid email";
    if (form.budget !== undefined && form.budget < 0) errs.budget = "Budget must be positive";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: keyof LeadFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = field === "budget" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={set("name")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={form.email} onChange={set("email")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input id="phone" value={form.phone || ""} onChange={set("phone")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="budget">Budget</label>
        <input id="budget" type="number" value={form.budget ?? ""} onChange={set("budget")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.budget && <p className="text-xs text-danger">{errors.budget}</p>}
      </div>
      <div>
        <label htmlFor="preferredLocation">Preferred Location</label>
        <input id="preferredLocation" value={form.preferredLocation || ""} onChange={set("preferredLocation")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="assignedAgent">Assigned Agent</label>
        <input id="assignedAgent" value={form.assignedAgentId} onChange={set("assignedAgentId")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select id="status" value={form.status} onChange={set("status")} className="w-full rounded-lg border border-border bg-background px-3 py-2">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="source">Source</label>
        <select id="source" value={form.source} onChange={set("source")} className="w-full rounded-lg border border-border bg-background px-3 py-2">
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" value={form.notes || ""} onChange={set("notes")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create Lead"}
      </button>
    </form>
  );
}
