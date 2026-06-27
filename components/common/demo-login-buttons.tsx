"use client";

import { useState } from "react";
import { ClerkLoaded, ClerkLoading, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Building2, Shield, User } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "agent",
    email: "agent@proplead.ai",
    password: "Agent123!",
    icon: User,
    desc: "Agent view",
  },
  {
    role: "manager",
    email: "manager@proplead.ai",
    password: "Manager123!",
    icon: Building2,
    desc: "Manager view",
  },
  {
    role: "admin",
    email: "admin@proplead.ai",
    password: "Admin123!",
    icon: Shield,
    desc: "Admin view",
  },
] as const;

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
    const firstError = err.errors[0];
    return firstError.message || firstError.code || "Sign-in failed";
  }
  if (err.message) return err.message;
  return "Sign-in failed";
}

function DemoButtons() {
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
      // Handle session already exists
      if (err.errors && err.errors[0]?.code === "session_exists") {
        console.log("Session already exists, redirecting to dashboard");
        router.push("/dashboard");
        return;
      }
      // Handle form validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const messages = err.errors.map((e: any) => e.message).join(", ");
        setError(messages);
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
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.role}
            variant="secondary"
            disabled={loadingRole !== null}
            onClick={() => login(account.email, account.password, account.role)}
            leftIcon={
              loadingRole === account.role ? (
                <Spinner size="sm" />
              ) : (
                <account.icon className="h-4 w-4" />
              )
            }
            className="justify-start"
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium capitalize">{account.role}</span>
              <span className="text-[11px] text-muted">{account.desc}</span>
            </div>
          </Button>
        ))}
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
