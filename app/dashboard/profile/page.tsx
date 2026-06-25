"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Save, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/10">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-[#2563EB]" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.fullName || "Your Name"}</p>
            <p className="text-sm text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">First Name</label>
              <input
                defaultValue={user?.firstName || ""}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Last Name</label>
              <input
                defaultValue={user?.lastName || ""}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              placeholder="e.g., Senior Agent"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
