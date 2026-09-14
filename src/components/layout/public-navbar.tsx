"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/properties", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help" },
];

const loggedInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/properties", label: "Properties" },
  { href: "/dashboard/ai-tools", label: "AI Tools" },
  { href: "/dashboard/profile", label: "Profile" },
];

export function PublicNavbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isSignedIn ? loggedInLinks : publicLinks;
  const initial = user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          PropLead
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-brand/5 text-brand font-medium"
                    : "text-muted hover:bg-neutral-100 dark:hover:bg-surface-alt hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-brand/10 p-1.5 pr-3 text-sm font-medium text-brand transition hover:bg-brand/15"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {initial}
              </div>
              Dashboard
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100 dark:hover:bg-surface-alt md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-brand/5 text-brand font-medium"
                      : "text-muted hover:bg-neutral-100 dark:hover:bg-surface-alt",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isSignedIn && (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/sign-in">
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
