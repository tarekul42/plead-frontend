import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plead.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/help",
    "/privacy",
    "/terms",
    "/properties",
    "/dashboard",
    "/sign-in",
    "/sign-up",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
