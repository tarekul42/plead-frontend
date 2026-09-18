import { useQuery, useMutation, useQueryClient } from "@tanstack/query";
import {
  contactApi,
  newsletterApi,
  publicApi,
  favoritesApi,
  propertiesApiExtended,
} from "@/lib/api-client";

export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: publicApi.stats,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: publicApi.testimonials,
  });
}

export function useFaq() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: publicApi.faq,
  });
}

export function usePublicBlogList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["public-blog", params],
    queryFn: () => publicApi.blogList(params),
  });
}

export function usePublicBlogPost(slug: string) {
  return useQuery({
    queryKey: ["public-blog", slug],
    queryFn: () => publicApi.blogGet(slug),
    enabled: !!slug,
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: contactApi.submit,
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: newsletterApi.subscribe,
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoritesApi.list(),
  });
}

export function useCheckFavorite(propertyId: string) {
  return useQuery({
    queryKey: ["favorites", propertyId],
    queryFn: () => favoritesApi.check(propertyId),
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
  return useQuery({
    queryKey: ["category-counts"],
    queryFn: propertiesApiExtended.categoryCounts,
  });
}
