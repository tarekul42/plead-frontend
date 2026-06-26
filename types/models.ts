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
  propertyType: string;
  status: string;
  features: string[];
  assignedAgentId: string;
  views: number;
  inquiriesCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  budget?: number;
  preferredLocation?: string;
  propertyType?: string;
  bedsDesired?: number;
  bathsDesired?: number;
  notes?: string;
  status: string;
  source?: string;
  assignedAgentId: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  _id: string;
  leadId: string;
  type: string;
  notes?: string;
  outcome?: string;
  performedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  propertyId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  authorId: string;
  publishedAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  agencyId: string;
  phone?: string;
  title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
