import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted">Page not found</p>
      <Link
        href="/"
        className="rounded-lg bg-brand px-6 py-2 text-white transition hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
