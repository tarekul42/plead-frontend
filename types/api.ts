export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AiMatchResult {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  score: number;
  reasons: string[];
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

export interface LeadListParams {
  status?: string;
  assignedAgentId?: string;
  q?: string;
  page?: number;
  limit?: number;
}
