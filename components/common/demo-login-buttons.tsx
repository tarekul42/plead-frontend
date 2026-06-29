"use client";

import { useState } from "react";
import { ClerkLoaded, ClerkLoading, useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Building2, Shield, AlertCircle } from "lucide-react";
import { DEMO_CREDENTIALS, type DemoRole } from "@/lib/constants";
import { setAuthToken } from "@/lib/api-client";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://plead-backend.vercel.app/api/v1").replace(/\/api\/v1\/?$/, "");

const ICON_MAP: Record<string, typeof User> = {
  agent: User,
  manager: Building2,
  admin: Shield,
};

function SkeletonButtons() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex h-[72px] items-center justify-center rounded-xl bg-muted/40 animate-pulse" />
      ))}
    </div>
  );
}

function DemoButtons() {
  const { signIn } = useSignIn();
  const clerk = useClerk();
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (_email: string, _password: string, role: DemoRole) => {
    if (!signIn) {
      setError("Sign-in is not available. Please try again later.");
      return;
    }
    setLoadingRole(role);
    setError(null);
    try {
      // Sign out first to prevent session_exists errors
      await clerk.signOut();
      await new Promise((r) => setTimeout(r, 50));

      const ticketRes = await fetch(`${API_BASE}/api/v1/auth/demo-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!ticketRes.ok) {
        const body = await ticketRes.json().catch(() => ({}));
        setError(body?.error?.message || "Failed to get demo sign-in ticket. Run `bun run seed` in the backend.");
        return;
      }

      const { data } = await ticketRes.json();
      const { error: createErr } = await signIn.create({ strategy: "ticket", ticket: data.token });

      if (createErr) {
        setError(createErr.message || createErr.longMessage || "Sign-in failed");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize();
        if (signIn.createdSessionId) {
          await clerk.setActive({ session: signIn.createdSessionId });
        }
        // Poll until session token is available (Clerk may need a tick to settle)
        let sessionToken: string | null | undefined = null;
        for (let i = 0; i < 20; i++) {
          sessionToken = await clerk.session?.getToken();
          if (sessionToken) break;
          await new Promise((r) => setTimeout(r, 50));
        }
        if (sessionToken) setAuthToken(sessionToken);
        router.push("/dashboard");
      } else {
        setError("Sign-in incomplete. Try again.");
      }
    } catch (err: any) {
      const clerkMsg = err.errors ? err.errors.map((e: any) => e.message).join(", ") : err.message || "";
      setError(clerkMsg || "Sign-in failed");
    } finally {
      setLoadingRole(null);
    }
  };

  if (!signIn) return null;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted font-semibold tracking-wider">
            Quick Demo Access
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {(Object.keys(DEMO_CREDENTIALS) as DemoRole[]).map((role) => {
          const cred = DEMO_CREDENTIALS[role];
          const hasCreds = cred.email && cred.password;
          const Icon = ICON_MAP[role] || User;
          const isLoading = loadingRole === role;

          return (
            <Button
              key={role}
              type="button"
              variant="outline"
              disabled={loadingRole !== null || !hasCreds}
              onClick={() => login(cred.email, cred.password, role)}
              className="flex h-auto flex-col items-center gap-1.5 px-2 py-3 transition-all hover:border-brand/40 hover:bg-brand/5 disabled:opacity-40"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Icon className="h-5 w-5 text-brand" />
              )}
              <span className="text-xs font-semibold leading-none">
                {cred.label}
              </span>
              <span className="text-[10px] leading-tight text-muted">
                {hasCreds ? "Auto-fill & sign in" : "Not configured"}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function DemoLoginButtons() {
  return (
    <>
      <ClerkLoading>
        <SkeletonButtons />
      </ClerkLoading>
      <ClerkLoaded>
        <DemoButtons />
      </ClerkLoaded>
    </>
  );
}
