"use client";

import { useState } from "react";
import Link from "next/link";
import { useProperties } from "@/lib/queries/use-properties";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { formatPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { PROPERTY_STATUS_LABELS, PROPERTY_STATUS_COLORS } from "@/lib/constants";
import { Plus, Edit2, Trash2, Sparkles, Search } from "lucide-react";

export default function DashboardPropertiesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useProperties({
    q: debouncedSearch || undefined,
    page,
    limit,
  });

  const properties = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta ? Math.ceil(data.meta.total / limit) : 1;

  return (
    <div>
      <PageHeader
        title="Properties"
        description={`${total} total ${total === 1 ? "property" : "properties"}`}
        action={
          <Link href="/dashboard/properties/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Property
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No properties found"
              message="Try adjusting your search or add a new property."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Beds/Baths</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property: any) => (
                    <tr
                      key={property._id}
                      className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50"
                    >
                      <td className="p-4 font-medium">{property.title}</td>
                      <td className="p-4 text-muted">{property.location}</td>
                      <td className="p-4 text-muted">{formatPrice(property.price)}</td>
                      <td className="p-4 text-muted">
                        {property.beds} / {property.baths}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            (PROPERTY_STATUS_COLORS as any)[property.status] as any || "default"
                          }
                        >
                          {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS] || property.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/properties/${property._id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface-alt"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-danger transition hover:bg-danger/5">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-success transition hover:bg-success/5">
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                total={total}
                pageSize={limit}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
