"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Dashboard Error</h2>
      <p className="text-muted">Something went wrong in the dashboard. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand px-6 py-2 text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
