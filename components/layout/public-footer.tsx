import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">PropLead AI</h3>
            <p className="text-sm text-muted">
              AI-powered real estate lead engine. Match, convert, close.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/properties" className="hover:text-foreground">Explore</Link>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link href="/about" className="hover:text-foreground">About</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/help" className="hover:text-foreground">Help</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Blog</h4>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/blog" className="hover:text-foreground">Latest posts</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} PropLead AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
