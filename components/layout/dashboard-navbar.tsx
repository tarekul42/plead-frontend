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
      <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:px-6">
        <button
          onClick={() => setMobileMenu(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100 dark:hover:bg-surface lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenu(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-background shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-xl font-bold">PropLead</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DashboardSidebar />
          </div>
        </div>
      )}
    </>
  );
}
