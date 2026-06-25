"use client";

import { use } from "react";
import Link from "next/link";
import { useProperty } from "@/lib/queries/use-properties";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertySkeleton } from "@/components/properties/property-skeleton";
import { PropertyGrid } from "@/components/properties/property-grid";
import { ErrorState } from "@/components/common/error-state";
import { formatPrice, formatDate } from "@/lib/utils";
import { Bed, Bath, Move, MapPin, ArrowLeft, Home, Eye, Calendar, ChevronRight } from "lucide-react";

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading, isError, refetch } = useProperty(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-neutral-200 dark:bg-[#1E293B]" />
          </div>
          <div className="space-y-4">
            <PropertySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Failed to load property" onRetry={() => refetch()} />
      </div>
    );
  }

  const property = data?.data;

  if (!property) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Property not found" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    available: "bg-[#10B981]/10 text-[#10B981]",
    under_contract: "bg-[#F59E0B]/10 text-[#F59E0B]",
    sold: "bg-danger/10 text-danger",
    rented: "bg-[#2563EB]/10 text-[#2563EB]",
  };

  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/properties" className="hover:text-foreground">Properties</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Description</h2>
            <p className="leading-relaxed text-muted">{property.description || "No description available."}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Key Information</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: "Price", value: formatPrice(property.price), icon: Home },
                { label: "Bedrooms", value: property.beds, icon: Bed },
                { label: "Bathrooms", value: property.baths, icon: Bath },
                { label: "Area", value: `${property.area?.toLocaleString()} sqft`, icon: Move },
                { label: "Type", value: property.propertyType, icon: Home },
                { label: "Status", value: property.status.replace("_", " "), icon: Home },
                { label: "Views", value: property.views?.toLocaleString() || "0", icon: Eye },
                { label: "Published", value: property.publishedAt ? formatDate(property.publishedAt) : "N/A", icon: Calendar },
              ].map((item) => (
                <div key={item.label} className="rounded-card border border-border bg-surface p-4">
                  <item.icon className="mb-2 h-4 w-4 text-muted" />
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {property.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Features & Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((f: string) => (
                  <span
                    key={f}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.coordinates && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Location</h2>
              <div className="flex h-64 items-center justify-center rounded-xl bg-neutral-100 dark:bg-[#1E293B]">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-6 w-6 text-muted" />
                  <p className="text-sm text-muted">{property.location}</p>
                  <p className="text-xs text-muted mt-1">
                    {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <p className="text-3xl font-bold text-[#2563EB]">{formatPrice(property.price)}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  statusColors[property.status] || "bg-neutral-100 text-muted"
                }`}
              >
                {property.status.replace("_", " ")}
              </span>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted" />
                    <span className="text-muted">Location</span>
                  </span>
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted" />
                    <span className="text-muted">Bedrooms</span>
                  </span>
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted" />
                    <span className="text-muted">Bathrooms</span>
                  </span>
                  <span>{property.baths}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Move className="h-4 w-4 text-muted" />
                    <span className="text-muted">Area</span>
                  </span>
                  <span>{property.area?.toLocaleString()} sqft</span>
                </div>
              </div>

              <Link
                href="/sign-up"
                className="mt-6 flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
