"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const demoAccounts = [
  { role: "Agent", email: "agent@proplead.ai" },
  { role: "Manager", email: "manager@proplead.ai" },
  { role: "Admin", email: "admin@proplead.ai" },
];

export function DemoLoginButtons() {
  const { isSignedIn } = useUser();

  if (isSignedIn) return null;

  return (
    <div className="w-full">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted">Demo login</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {demoAccounts.map((account) => (
          <Link
            key={account.role}
            href={`/sign-in?demo=${account.email}`}
            className="block rounded-lg border border-border px-4 py-2.5 text-center text-sm transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Try as {account.role}
          </Link>
        ))}
      </div>
    </div>
  );
}
