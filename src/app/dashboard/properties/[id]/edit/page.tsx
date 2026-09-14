"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/dashboard/properties"), 1500);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/properties" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to properties
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Title</label>
              <input defaultValue="Sample Property" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <div className="flex items-start gap-2 mb-2">
                <button type="button" className="flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-xs text-success transition hover:bg-success/20">
                  <Sparkles className="h-3 w-3" />
                  Regenerate with AI
                </button>
              </div>
              <textarea rows={4} defaultValue="A beautiful property in a great location." className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand resize-y" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Price</label>
              <input type="number" defaultValue={500000} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Location</label>
              <input defaultValue="Brooklyn, NY" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Details</h2>
          <div className="grid gap-5 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Bedrooms</label>
              <input type="number" defaultValue={3} min={0} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Bathrooms</label>
              <input type="number" defaultValue={2} min={0} required step="0.5" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Area (sqft)</label>
              <input type="number" defaultValue={1500} min={0} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Property Type</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saved}
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Update Property"}
          </button>
          <Link
            href="/dashboard/properties"
            className="rounded-lg border border-border px-6 py-2.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
