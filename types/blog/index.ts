export type BlogStatus = "draft" | "published";

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
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {}
