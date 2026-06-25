export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "condo",
  "townhouse",
  "land",
  "commercial",
] as const;

export const PROPERTY_STATUSES = [
  "available",
  "sold",
  "rented",
  "pending",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "negotiating",
  "closed",
  "lost",
] as const;

export const INTERACTION_TYPES = [
  "call",
  "email",
  "meeting",
  "note",
  "tour",
  "other",
] as const;

export const ROLES = ["agent", "manager", "admin"] as const;

export const AI_TONES = {
  description: ["luxury", "standard", "brief"] as const,
  email: ["professional", "friendly", "urgent"] as const,
};
