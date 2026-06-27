import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-7xl font-bold text-brand">404</div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button leftIcon={<Home className="h-4 w-4" />}>
          Go home
        </Button>
      </Link>
    </div>
  );
}
