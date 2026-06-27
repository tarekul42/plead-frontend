"use client";

import { useState } from "react";
import { ClerkLoaded, ClerkLoading, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Building2, Shield, User } from "lucide-react";

interface DemoAccount {
  role: string;
  email: string;
  password: string;
}

const DEFAULT_ACCOUNTS: DemoAccount[] = [
  { role: "agent", email: "agent@proplead.ai", password: "Agent#123!" },
  { role: "manager", email: "manager@proplead.ai", password: "Manager#123!" },
  { role: "admin", email: "admin@proplead.ai", password: "Admin@u#123!" },
];

const ICON_MAP: Record<string, typeof User> = {
  agent: User,
  manager: Building2,
  admin: Shield,
};

const DESC_MAP: Record<string, string> = {
  agent: "Agent view",
  manager: "Manager view",
  admin: "Admin view",
};

function SkeletonButtons() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-12 rounded-md bg-muted/40 animate-pulse" />
      ))}
    </div>
  );
}

function getErrorMessage(err: any): string {
  if (!err) return "Sign-in failed";
  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors[0].message || err.errors[0].code || "Sign-in failed";
  }
  if (err.message) return err.message;
  return "Sign-in failed";
}

function DemoButtons({ accounts }: { accounts: DemoAccount[] }) {
  const signInState = useSignIn() as any;
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: string) => {
    if (!signInState?.signIn) {
      setError("Sign-in is not available. Please try again later.");
      return;
    }
    setLoadingRole(role);
    setError(null);
    try {
      const result = await signInState.signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await signInState.setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Sign-in not complete. Please try again.");
      }
    } catch (err: any) {
      if (err.errors && err.errors[0]?.code === "session_exists") {
        router.push("/dashboard");
        return;
      }
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map((e: any) => e.message).join(", "));
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoadingRole(null);
    }
  };

  if (!signInState?.signIn) return null;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted">Quick demo login</span>
        </div>
      </div>
      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      )}
      <div className="grid gap-2">
        {accounts.map((account) => {
          const Icon = ICON_MAP[account.role] || User;
          return (
            <Button
              key={account.role}
              variant="secondary"
              disabled={loadingRole !== null}
              onClick={() => login(account.email, account.password, account.role)}
              leftIcon={
                loadingRole === account.role ? <Spinner size="sm" /> : <Icon className="h-4 w-4" />
              }
              className="justify-start"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium capitalize">{account.role}</span>
                <span className="text-[11px] text-muted">{DESC_MAP[account.role]}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function DemoLoginButtons() {
  const [accounts] = useState<DemoAccount[]>(DEFAULT_ACCOUNTS);

  return (
    <>
      <ClerkLoading>
        <SkeletonButtons />
      </ClerkLoading>
      <ClerkLoaded>
        <DemoButtons accounts={accounts} />
      </ClerkLoaded>
    </>
  );
}
