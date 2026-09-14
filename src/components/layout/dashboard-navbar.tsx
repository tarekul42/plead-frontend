"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ProfileDropdown } from "./profile-dropdown";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardNavbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenu(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100 dark:hover:bg-surface-alt lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenu(false)} />
          <div className="relative flex w-72 animate-in slide-in-from-left">
            <DashboardSidebar mobile onClose={() => setMobileMenu(false)} />
            <button
              onClick={() => setMobileMenu(false)}
              className="flex h-12 w-12 items-center justify-center text-white"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
