"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProperty, useProperties } from "@/lib/queries/use-properties";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertySkeleton } from "@/components/properties/property-skeleton";
import { PropertyCard } from "@/components/properties/property-card";
import { ErrorState } from "@/components/common/error-state";
import { ReviewSection } from "@/components/properties/review-section";
import { formatPrice, formatDate, formatPricePerSqft } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Move,
  MapPin,
  ArrowLeft,
  Home,
  Eye,
  Calendar,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";

const statusVariants: Record<string, "success" | "warning" | "danger" | "brand"> = {
  available: "success",
  pending: "warning",
  sold: "danger",
  rented: "brand",
};

function SpecCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 transition hover:shadow-sm">
      <Icon className="mb-2 h-4 w-4 text-muted" />
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function PropertyMap({ property }: { property: any }) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Location</h2>
      <div className="flex h-64 items-center justify-center rounded-xl bg-neutral-100 dark:bg-surface-alt">
        <div className="text-center">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-muted" />
          <p className="text-sm text-muted">{property.location}</p>
          {property.coordinates && (
            <p className="mt-1 text-xs text-muted">
              {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RelatedProperties({ currentId, propertyType }: { currentId: string; propertyType: string }) {
  const { data, isLoading } = useProperties({ limit: 3, propertyType });
  const related = data?.data?.filter((p: any) => p._id !== currentId) || [];

  if (!related.length) return null;

  return (
    <div className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">Similar Properties</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.slice(0, 3).map((property: any) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading, isError, refetch } = useProperty(slug);
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] animate-pulse rounded-xl bg-neutral-200 dark:bg-surface" />
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

  const property = data;

  if (!property) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Property not found" />
      </div>
    );
  }

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
            <p className="leading-relaxed text-muted">
              {property.description || "No description available."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Key Information</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <SpecCard icon={Home} label="Price" value={formatPrice(property.price)} />
              <SpecCard icon={Bed} label="Bedrooms" value={String(property.beds)} />
              <SpecCard icon={Bath} label="Bathrooms" value={String(property.baths)} />
              <SpecCard icon={Move} label="Area" value={`${property.area?.toLocaleString()} sqft`} />
              <SpecCard icon={Home} label="Type" value={property.propertyType} />
              <SpecCard icon={Home} label="Status" value={property.status.replace("_", " ")} />
              <SpecCard icon={Eye} label="Views" value={property.views?.toLocaleString() || "0"} />
              <SpecCard
                icon={Calendar}
                label="Published"
                value={property.publishedAt ? formatDate(property.publishedAt) : "N/A"}
              />
            </div>
          </div>

          {property.coordinates && <PropertyMap property={property} />}

          <RelatedProperties currentId={property._id} propertyType={property.propertyType} />

          <div className="mt-16">
            <ReviewSection propertyId={property._id} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <p className="text-3xl font-bold text-brand">{formatPrice(property.price)}</p>
              <p className="mt-1 text-xs text-muted">
                {formatPricePerSqft(property.price, property.area)}
              </p>
              <div className="mt-3">
                <Badge variant={statusVariants[property.status] || "default"}>
                  {property.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <MapPin className="h-4 w-4" />
                    Location
                  </span>
                  <span className="font-medium">{property.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <Bed className="h-4 w-4" />
                    Bedrooms
                  </span>
                  <span className="font-medium">{property.beds}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <Bath className="h-4 w-4" />
                    Bathrooms
                  </span>
                  <span className="font-medium">{property.baths}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <Move className="h-4 w-4" />
                    Area
                  </span>
                  <span className="font-medium">{property.area?.toLocaleString()} sqft</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link href="/sign-up">
                  <Button className="w-full" size="lg">
                    Inquire Now
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    leftIcon={<Heart className={`h-4 w-4 ${saved ? "fill-danger text-danger" : ""}`} />}
                    onClick={() => setSaved(!saved)}
                  >
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="secondary" className="flex-1" leftIcon={<Share2 className="h-4 w-4" />}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
