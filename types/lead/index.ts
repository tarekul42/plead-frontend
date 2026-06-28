export type LeadStatus = "new" | "contacted" | "qualified" | "negotiating" | "closed" | "lost";

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
  status: LeadStatus;
  source?: string;
  assignedAgentId: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListParams {
  status?: string;
  assignedAgentId?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  budget?: number;
  preferredLocation?: string;
  propertyType?: string;
  bedsDesired?: number;
  bathsDesired?: number;
  notes?: string;
  source?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  status?: LeadStatus;
}
