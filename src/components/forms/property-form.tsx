"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  price: z.coerce.number().min(0, "Price must be positive"),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  beds: z.coerce.number().min(0).max(100),
  baths: z.coerce.number().min(0).max(100),
  area: z.coerce.number().min(0),
  propertyType: z.enum(["house", "apartment", "condo", "townhouse", "land", "commercial"]),
  status: z.enum(["available", "sold", "rented", "pending"]).optional(),
  images: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  onSubmit: (data: PropertyFormValues) => void | Promise<void>;
  initialData?: Partial<PropertyFormValues>;
}

const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
] as const;

export function PropertyForm({ onSubmit, initialData }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as never,
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      location: initialData?.location ?? "",
      address: initialData?.address ?? "",
      beds: initialData?.beds ?? 0,
      baths: initialData?.baths ?? 0,
      area: initialData?.area ?? 0,
      propertyType: initialData?.propertyType ?? "house",
      status: initialData?.status ?? "available",
      images: initialData?.images ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      <FormField label="Title" error={errors.title} htmlFor="title" required>
        <Input id="title" {...register("title")} />
      </FormField>

      <FormField label="Description" error={errors.description} htmlFor="description" required>
        <Textarea id="description" rows={4} {...register("description")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Price" error={errors.price} htmlFor="price" required>
          <Input id="price" type="number" {...register("price")} />
        </FormField>

        <FormField label="Location" error={errors.location} htmlFor="location" required>
          <Input id="location" {...register("location")} />
        </FormField>

        <FormField label="Beds" error={errors.beds} htmlFor="beds" required>
          <Input id="beds" type="number" {...register("beds")} />
        </FormField>

        <FormField label="Baths" error={errors.baths} htmlFor="baths" required>
          <Input id="baths" type="number" step="0.5" {...register("baths")} />
        </FormField>

        <FormField label="Area (sqft)" error={errors.area} htmlFor="area" required>
          <Input id="area" type="number" {...register("area")} />
        </FormField>

        <FormField label="Property Type" error={errors.propertyType} htmlFor="propertyType" required>
          <Select id="propertyType" {...register("propertyType")}>
            {PROPERTY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Address" error={errors.address} htmlFor="address">
        <Input id="address" {...register("address")} />
      </FormField>

      <FormField label="Status" error={errors.status} htmlFor="status">
        <Select id="status" {...register("status")}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="pending">Pending</option>
        </Select>
      </FormField>

      <FormField label="Images (URLs, comma-separated)" error={errors.images} htmlFor="images">
        <Input
          id="images"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          {...register("images")}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Property"}
      </Button>
    </form>
  );
}
