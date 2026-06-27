"use client";

import { useState } from "react";
import Link from "next/link";
import { Bed, Bath, Move, MapPin, Heart, Eye } from "lucide-react";
import { formatPrice, formatPricePerSqft, formatCompactPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "brand"> = {
  available: "success",
  pending: "warning",
  sold: "danger",
  rented: "brand",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-card border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <Link
        href={`/properties/${property.slug}`}
        className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-neutral-200 dark:bg-surface"
      >
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={statusVariants[property.status] || "default"}>
            {property.status.replace("_", " ")}
          </Badge>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved(!saved);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition hover:bg-background"
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={`h-4 w-4 transition ${saved ? "fill-danger text-danger" : "text-foreground"}`}
          />
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/properties/${property.slug}`}>
          <h3 className="mb-1 font-semibold leading-snug transition group-hover:text-brand">
            {property.title}
          </h3>
        </Link>
        <p className="mb-3 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>
        <div className="mb-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Move className="h-3.5 w-3.5" /> {property.area?.toLocaleString()} sqft
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-brand">{formatCompactPrice(property.price)}</p>
            <p className="text-[11px] text-muted">
              {formatPricePerSqft(property.price, property.area)}
            </p>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100 dark:hover:bg-surface-alt"
          >
            <Eye className="h-3 w-3" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
