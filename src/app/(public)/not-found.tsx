import Link from "next/link";
import { Search, Home, FileText, HelpCircle } from "lucide-react";

const suggestions = [
  { icon: Home, label: "Explore Properties", href: "/properties" },
  { icon: FileText, label: "Read the Blog", href: "/blog" },
  { icon: HelpCircle, label: "Visit Help Center", href: "/help" },
];

export default function PublicNotFound() {
  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <div className="mb-8 text-8xl font-bold text-brand/10">404</div>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Page Not Found</h1>
        <p className="mb-8 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mb-8 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted" />
          <Link href="/properties" className="text-sm text-brand hover:underline">
            Search properties instead
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-4 text-sm font-medium text-muted">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm transition hover:border-brand/30 hover:shadow-sm"
              >
                <s.icon className="h-4 w-4 text-brand" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
