"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}

export function Pagination({ page, totalPages, onPageChange, total, pageSize = 12 }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = total ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {total && (
        <p className="text-xs text-muted">
          Showing <span className="font-medium text-foreground">{start}</span>-
          <span className="font-medium text-foreground">{end}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> properties
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => (
            <span key={p} className="flex items-center gap-1">
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="flex h-9 w-9 items-center justify-center text-xs text-muted">
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-sm transition",
                  p === page
                    ? "bg-brand text-white shadow-sm"
                    : "border border-border hover:bg-neutral-100 dark:hover:bg-surface-alt",
                )}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            </span>
          ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-neutral-100 dark:hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
