"use client";

import Link from "next/link";
import { useProperties } from "@/lib/queries/use-properties";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function DashboardPropertiesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useProperties({ q: search || undefined, limit: 50 });
  const properties = data?.data || [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted">{properties.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-neutral-200 dark:bg-[#1E293B]" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No properties found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Beds/Baths</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property: any) => (
                  <tr key={property._id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-[#1E293B]/50">
                    <td className="p-4 font-medium">{property.title}</td>
                    <td className="p-4 text-muted">{property.location}</td>
                    <td className="p-4 text-muted">{formatPrice(property.price)}</td>
                    <td className="p-4 text-muted">{property.beds} / {property.baths}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        property.status === "available" ? "bg-success/10 text-success" :
                        property.status === "under_contract" ? "bg-warning/10 text-warning" :
                        property.status === "sold" ? "bg-danger/10 text-danger" :
                        "bg-brand/10 text-brand"
                      }`}>
                        {property.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/properties/${property._id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-danger transition hover:bg-danger/5">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-success transition hover:bg-success/5">
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
