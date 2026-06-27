"use client";

import { useState } from "react";

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  area: number;
  propertyType: string;
}

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void | Promise<void>;
  initialData?: Partial<PropertyFormData>;
}

const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Townhouse", "Land", "Commercial"];

export function PropertyForm({ onSubmit, initialData }: PropertyFormProps) {
  const [form, setForm] = useState<PropertyFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    location: initialData?.location || "",
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    area: initialData?.area || 0,
    propertyType: initialData?.propertyType || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title || form.title.length < 3) errs.title = "Title must be at least 3 characters";
    if (!form.description || form.description.length < 10) errs.description = "Description must be at least 10 characters";
    if (form.price <= 0) errs.price = "Price must be positive";
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

  const set = (field: keyof PropertyFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = field === "price" || field === "beds" || field === "baths" || field === "area"
      ? Number(e.target.value)
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" value={form.title} onChange={set("title")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.title && <p className="text-xs text-danger">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={form.description} onChange={set("description")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input id="price" type="number" value={form.price || ""} onChange={set("price")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
        {errors.price && <p className="text-xs text-danger">{errors.price}</p>}
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input id="location" value={form.location} onChange={set("location")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="beds">Beds</label>
        <input id="beds" type="number" value={form.beds || ""} onChange={set("beds")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="baths">Baths</label>
        <input id="baths" type="number" value={form.baths || ""} onChange={set("baths")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="area">Area</label>
        <input id="area" type="number" value={form.area || ""} onChange={set("area")} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="propertyType">Property Type</label>
        <select id="propertyType" value={form.propertyType} onChange={set("propertyType")} className="w-full rounded-lg border border-border bg-background px-3 py-2">
          <option value="">Select type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create Property"}
      </button>
    </form>
  );
}
