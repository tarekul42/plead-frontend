export interface AiMatchResult {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  score: number;
  reasons: string[];
}

export interface AiMatchResponse {
  matches: AiMatchResult[];
  provider: string;
  tokensUsed: number;
  cached: boolean;
}

export interface AiDescriptionResult {
  title: string;
  description: string;
  highlights: string[];
  provider: string;
  tokensUsed: number;
  cached: boolean;
}

export interface AiEmailResult {
  subject: string;
  body: string;
  provider: string;
  tokensUsed: number;
  cached: boolean;
}

export interface AiMatchInput {
  leadId: string;
  propertyIds?: string[];
}

export interface AiDescriptionInput {
  propertyId: string;
  tone: string;
}

export interface AiEmailInput {
  leadId: string;
  propertyId: string;
  tone: string;
}

export type Tone = "luxury" | "standard" | "brief" | "professional" | "friendly" | "urgent";
