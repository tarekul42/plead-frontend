export type Role = "agent" | "manager" | "admin";

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  agencyId: string;
  phone?: string;
  title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  title?: string;
  avatarUrl?: string;
}
