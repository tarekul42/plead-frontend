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

import { SectionHeader } from "@/components/landing/section-header";
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

const gradients = [
  "from-blue-500/20 to-blue-600/10",
  "from-emerald-500/20 to-emerald-600/10",
  "from-amber-500/20 to-amber-600/10",
  "from-purple-500/20 to-purple-600/10",
  "from-rose-500/20 to-rose-600/10",
  "from-cyan-500/20 to-cyan-600/10",
];

export function PropertyCategories() {
  const { data: counts } = useCategoryCounts();

  const categories = PROPERTY_CATEGORIES.map((cat, i) => {
    const countItem = counts?.find((c) => c._id === cat.slug);
    return {
      ...cat,
      Icon: iconMap[cat.icon] ?? Building2,
      count: countItem?.count ?? 0,
      gradient: gradients[i % gradients.length],
    };
  });

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse by type"
          title="Find your perfect property"
          subtitle="Explore listings across every category."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                className={`group flex items-center gap-4 rounded-card border border-border bg-gradient-to-br p-6 shadow-sm transition-all hover:shadow-md hover:border-brand/30 ${cat.gradient}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 shadow-sm">
                  <cat.Icon className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <p className="font-semibold">{cat.label}</p>
                  <p className="text-sm text-muted">{cat.count} listings</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
