"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Save, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-brand" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.fullName || "Your Name"}</p>
            <p className="text-sm text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
              <Input id="firstName" defaultValue={user?.firstName || ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
              <Input id="lastName" defaultValue={user?.lastName || ""} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">Title</label>
            <Input id="title" placeholder="e.g., Senior Agent" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>

          <Button type="submit">
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
