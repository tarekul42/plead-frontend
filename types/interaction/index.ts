export type InteractionType = "call" | "email" | "meeting" | "note" | "tour" | "other";

export interface Interaction {
  _id: string;
  leadId: string;
  type: InteractionType;
  notes?: string;
  outcome?: string;
  performedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInteractionInput {
  type: InteractionType;
  notes?: string;
  outcome?: string;
}
