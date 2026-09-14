"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, ExternalLink, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";

export function ProfileDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { role } = useCurrentUser();

  const initial = user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-neutral-100 dark:hover:bg-surface-alt">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
            {initial}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user?.fullName || "User"}</p>
          <p className="text-xs text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
          {role && (
            <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand uppercase tracking-wider">
              {role}
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuItem>
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Public site
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <><Sun className="h-4 w-4" /> Light mode</>
          ) : (
            <><Moon className="h-4 w-4" /> Dark mode</>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="danger"
          onClick={() => signOut(() => router.push("/"))}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
