import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-brand px-6 py-2 text-white transition hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
