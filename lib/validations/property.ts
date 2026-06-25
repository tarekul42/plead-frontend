import { z } from "zod";

export const propertySchema = z.object({
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
  images: z.array(z.string()).min(1, "At least one image is required"),
  features: z.array(z.string()).optional(),
  assignedAgentId: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
  preferredLocation: z.string().optional(),
  bedsDesired: z.coerce.number().min(0).optional(),
  bathsDesired: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  assignedAgentId: z.string(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
