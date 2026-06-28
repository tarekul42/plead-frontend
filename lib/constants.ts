export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "condo",
  "townhouse",
  "land",
  "commercial",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUSES = [
  "available",
  "pending",
  "sold",
  "rented",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "negotiating",
  "closed",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const INTERACTION_TYPES = [
  "call",
  "email",
  "meeting",
  "note",
  "tour",
  "other",
] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];

export const USER_ROLES = ["agent", "manager", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  condo: "Condo",
  townhouse: "Townhouse",
  land: "Land",
  commercial: "Commercial",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: "Available",
  pending: "Pending",
  sold: "Sold",
  rented: "Rented",
};

export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
  available: "success",
  pending: "warning",
  sold: "danger",
  rented: "brand",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  negotiating: "Negotiating",
  closed: "Closed",
  lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "brand",
  contacted: "warning",
  qualified: "brand-light",
  negotiating: "warning-light",
  closed: "success",
  lost: "danger",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  agent: "Agent",
  manager: "Manager",
  admin: "Admin",
};

export const DEMO_CREDENTIALS = {
  agent: {
    email: process.env.NEXT_PUBLIC_DEMO_AGENT_EMAIL ?? "agent@proplead.ai",
    password: process.env.NEXT_PUBLIC_DEMO_AGENT_PASSWORD ?? "Ag7$k9mX!pQ2",
    label: "Agent",
    description: "Property listings & leads",
  },
  manager: {
    email: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL ?? "manager@proplead.ai",
    password: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD ?? "Mgr8$jL3!nR5",
    label: "Manager",
    description: "Team oversight & analytics",
  },
  admin: {
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@proplead.ai",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "Adm4$vB7!wX1",
    label: "Admin",
    description: "Platform administration",
  },
} as const;

export type DemoRole = keyof typeof DEMO_CREDENTIALS;

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  agent: "brand",
  manager: "warning",
  admin: "danger",
};

export interface Category {
  label: string;
  icon: string;
  slug: string;
}

export const PROPERTY_CATEGORIES: Category[] = [
  { label: "Houses", icon: "Home", slug: "house" },
  { label: "Apartments", icon: "Building", slug: "apartment" },
  { label: "Condos", icon: "Building2", slug: "condo" },
  { label: "Townhouses", icon: "Warehouse", slug: "townhouse" },
  { label: "Land", icon: "TreePine", slug: "land" },
  { label: "Commercial", icon: "Store", slug: "commercial" },
];
