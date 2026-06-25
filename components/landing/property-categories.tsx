"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Building2, Building, Warehouse, TreePine, Store, type LucideIcon } from "lucide-react";

const categories: { label: string; icon: LucideIcon; slug: string; count: string }[] = [
  { label: "Houses", icon: Home, slug: "house", count: "240+" },
  { label: "Condos", icon: Building2, slug: "condo", count: "180+" },
  { label: "Apartments", icon: Building, slug: "apartment", count: "320+" },
  { label: "Townhouses", icon: Warehouse, slug: "townhouse", count: "95+" },
  { label: "Land", icon: TreePine, slug: "land", count: "60+" },
  { label: "Commercial", icon: Store, slug: "commercial", count: "45+" },
];

export function PropertyCategories() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/properties?propertyType=${cat.slug}`}
                className="flex flex-col items-center gap-3 rounded-card border border-border p-6 text-center shadow-sm transition hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <div className="rounded-full bg-[#2563EB]/5 p-3">
                  <cat.icon className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-medium">{cat.label}</p>
                  <p className="text-xs text-muted">{cat.count} listings</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
