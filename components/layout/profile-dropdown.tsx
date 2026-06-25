"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ProfileDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-neutral-100 dark:hover:bg-surface"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
          {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U"}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg">
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium">{user?.fullName || "User"}</p>
            <p className="text-xs text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="mt-1 space-y-0.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
            >
              <Settings className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
            >
              <ExternalLink className="h-4 w-4" />
              Public site
            </Link>
          </div>

          <div className="mt-1 border-t border-border pt-1">
            <button
              onClick={() => signOut(() => router.push("/"))}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger transition hover:bg-danger/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
