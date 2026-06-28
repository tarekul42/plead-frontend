export type PropertyType = "house" | "apartment" | "condo" | "townhouse" | "land" | "commercial";
export type PropertyStatus = "available" | "sold" | "rented" | "pending";

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  images: string[];
  beds: number;
  baths: number;
  area: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  features: string[];
  assignedAgentId: string;
  views: number;
  inquiriesCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListParams {
  q?: string;
  location?: string;
  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  images?: string[];
  beds: number;
  baths: number;
  area: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  features?: string[];
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {}
