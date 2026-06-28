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

export interface CreateReviewInput {
  rating: number;
  title?: string;
  comment?: string;
}

export type UpdateReviewInput = Partial<CreateReviewInput>;
