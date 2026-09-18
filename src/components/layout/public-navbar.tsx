"use client";

import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = isSignedIn ? loggedInLinks : publicLinks;
  const initial =
    user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          PropLead
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : scrolled
                      ? "text-muted hover:bg-border hover:text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/10",
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
              className={cn(
                "flex items-center gap-2 rounded-lg p-1.5 pr-3 text-sm font-medium transition",
                scrolled
                  ? "bg-brand/10 text-brand hover:bg-brand/15"
                  : "bg-white/10 text-foreground hover:bg-white/20",
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {initial}
              </div>
              Dashboard
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    !scrolled && "text-foreground hover:bg-white/10 hover:text-foreground",
                  )}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className={cn(
                    !scrolled && "bg-foreground text-background hover:bg-foreground/90",
                  )}
                >
                  Get started
                </Button>
              </Link>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition sm:hidden",
              scrolled
                ? "hover:bg-border"
                : "hover:bg-white/10",
            )}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background sm:hidden">
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
                      : "text-muted hover:bg-border",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isSignedIn && (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/sign-in">
                  <Button variant="secondary" className="w-full">
                    Sign in
                  </Button>
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
