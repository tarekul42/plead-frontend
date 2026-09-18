"use client";

import { motion } from "framer-motion";
import {
  Building,
  Building2,
  Home,
  type LucideIcon,
  Store,
  TreePine,
  Warehouse,
} from "lucide-react";
import Link from "next/link";

import { PROPERTY_CATEGORIES } from "@/lib/constants";
import { useCategoryCounts } from "@/lib/queries/use-public";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  Building,
  Warehouse,
  TreePine,
  Store,
};

export function PropertyCategories() {
  const { data: counts } = useCategoryCounts();

  const categories = PROPERTY_CATEGORIES.map((cat) => {
    const countItem = counts?.find((c) => c._id === cat.slug);
    return {
      ...cat,
      Icon: iconMap[cat.icon] ?? Building2,
      count: countItem?.count ?? 0,
    };
  });

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
                className="flex flex-col items-center gap-3 rounded-card border border-border p-6 text-center shadow-sm transition hover:border-brand/30 hover:shadow-md"
              >
                <div className="rounded-full bg-brand/5 p-3">
                  <cat.Icon className="h-6 w-6 text-brand" />
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
