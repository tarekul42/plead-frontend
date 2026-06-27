"use client";

import Link from "next/link";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";

export function PublicNavbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          PropLead
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/properties" className="text-sm text-muted transition hover:text-foreground">
            Explore
          </Link>
          <Link href="/about" className="text-sm text-muted transition hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted transition hover:text-foreground">
            Contact
          </Link>
          <Link href="/blog" className="text-sm text-muted transition hover:text-foreground">
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Dashboard
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="secondary">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
