import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  contactApi,
  newsletterApi,
  publicApi,
  favoritesApi,
  propertiesApiExtended,
} from "@/lib/api-client";

export interface PublicStats {
  propertiesListed: number;
  leadsTracked: number;
  aiMatchesMade: number;
  avgCloseTimeReduction: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  author: string;
}

export interface CategoryCount {
  _id: string;
  count: number;
}

export interface FavoriteCheck {
  isFavorited: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export function usePublicStats() {
  return useQuery<PublicStats>({
    queryKey: ["public-stats"],
    queryFn: () => publicApi.stats() as Promise<PublicStats>,
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => publicApi.testimonials() as Promise<Testimonial[]>,
  });
}

export function useFaq() {
  return useQuery<FaqItem[]>({
    queryKey: ["faq"],
    queryFn: () => publicApi.faq() as Promise<FaqItem[]>,
  });
}

export function usePublicBlogList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<BlogPost>>({
    queryKey: ["public-blog", params],
    queryFn: () => publicApi.blogList(params) as Promise<PaginatedResponse<BlogPost>>,
  });
}

export function usePublicBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ["public-blog", slug],
    queryFn: () => publicApi.blogGet(slug) as Promise<BlogPost>,
    enabled: !!slug,
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; subject: string; message: string; propertyId?: string }) =>
      contactApi.submit(data) as Promise<{ success: boolean }>,
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      newsletterApi.subscribe(data) as Promise<{ success: boolean }>,
  });
}

export function useFavorites() {
  return useQuery<PaginatedResponse<{ _id: string; propertyId: string }>>({
    queryKey: ["favorites"],
    queryFn: () => favoritesApi.list() as Promise<PaginatedResponse<{ _id: string; propertyId: string }>>,
  });
}

export function useCheckFavorite(propertyId: string) {
  return useQuery<FavoriteCheck>({
    queryKey: ["favorites", propertyId],
    queryFn: () => favoritesApi.check(propertyId) as Promise<FavoriteCheck>,
    enabled: !!propertyId,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      propertyId,
      isFavorited,
    }: {
      propertyId: string;
      isFavorited: boolean;
    }) => {
      if (isFavorited) return favoritesApi.remove(propertyId);
      return favoritesApi.add(propertyId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useCategoryCounts() {
  return useQuery<CategoryCount[]>({
    queryKey: ["category-counts"],
    queryFn: () => propertiesApiExtended.categoryCounts() as Promise<CategoryCount[]>,
  });
}
