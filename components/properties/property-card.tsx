import Link from "next/link";
import { Bed, Bath, Move, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusColors: Record<string, string> = {
    available: "bg-[#10B981]/10 text-[#10B981]",
    under_contract: "bg-[#F59E0B]/10 text-[#F59E0B]",
    sold: "bg-danger/10 text-danger",
    rented: "bg-[#2563EB]/10 text-[#2563EB]",
  };

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block rounded-card border border-border bg-surface shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-neutral-200 dark:bg-[#1E293B]">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[property.status] || "bg-neutral-100 text-muted"
          }`}
        >
          {property.status.replace("_", " ")}
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold leading-snug group-hover:text-[#2563EB]">
          {property.title}
        </h3>
        <p className="mb-3 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {property.location}
        </p>
        <div className="mb-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> {property.beds} beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.baths} baths
          </span>
          <span className="flex items-center gap-1">
            <Move className="h-3.5 w-3.5" /> {property.area?.toLocaleString()} sqft
          </span>
        </div>
        <p className="text-lg font-bold text-[#2563EB]">{formatPrice(property.price)}</p>
      </div>
    </Link>
  );
}
