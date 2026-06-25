"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#2563EB] px-6 py-2 text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
