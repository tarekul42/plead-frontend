"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?[\d\s\-().]{7,20}$/, "Invalid phone number").optional().or(z.literal("")),
  budget: z.coerce.number().min(0, "Budget must be positive").optional(),
  preferredLocation: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  assignedAgentId: z.string().min(1, "Assigned agent is required"),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  onSubmit: (data: LeadFormValues) => void | Promise<void>;
  initialData?: Partial<LeadFormValues>;
}

const STATUS_OPTIONS = ["new", "contacted", "qualified", "negotiating", "closed", "lost"];
const SOURCE_OPTIONS = ["website", "referral", "call", "email", "walk-in", "other"];

export function LeadForm({ onSubmit, initialData }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema) as never,
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      budget: initialData?.budget ?? undefined,
      preferredLocation: initialData?.preferredLocation ?? "",
      notes: initialData?.notes ?? "",
      status: initialData?.status ?? "new",
      source: initialData?.source ?? "website",
      assignedAgentId: initialData?.assignedAgentId ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate className="space-y-4">
      <FormField label="Name" error={errors.name} htmlFor="name" required>
        <Input id="name" {...register("name")} />
      </FormField>

      <FormField label="Email" error={errors.email} htmlFor="email" required>
        <Input id="email" {...register("email")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" error={errors.phone} htmlFor="phone">
          <Input id="phone" {...register("phone")} />
        </FormField>

        <FormField label="Budget" error={errors.budget} htmlFor="budget">
          <Input id="budget" type="number" {...register("budget")} />
        </FormField>

        <FormField label="Preferred Location" error={errors.preferredLocation} htmlFor="preferredLocation">
          <Input id="preferredLocation" {...register("preferredLocation")} />
        </FormField>

        <FormField label="Assigned Agent" error={errors.assignedAgentId} htmlFor="assignedAgent" required>
          <Input id="assignedAgent" {...register("assignedAgentId")} />
        </FormField>

        <FormField label="Status" error={errors.status} htmlFor="status">
          <Select id="status" {...register("status")}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Source" error={errors.source} htmlFor="source">
          <Select id="source" {...register("source")}>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Notes" error={errors.notes} htmlFor="notes">
        <Textarea id="notes" rows={3} {...register("notes")} />
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Lead"}
      </Button>
    </form>
  );
}
