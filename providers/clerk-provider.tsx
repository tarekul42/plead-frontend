"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { setAuthToken, setTokenGetter } from "@/lib/api-client";

function AuthTokenSetter() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      setTokenGetter(() => getToken());
      getToken().then((token) => {
        if (token) setAuthToken(token);
      });
    } else {
      setTokenGetter(null);
      setAuthToken(null);
    }
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#2563EB", borderRadius: "8px" },
        elements: {
          card: "shadow-sm border border-border",
          socialButtonsBlockButton: "border border-border hover:bg-neutral-100 dark:hover:bg-surface",
          formButtonPrimary: "bg-[#2563EB] hover:opacity-90 shadow-none",
          formFieldInput: "border-border rounded-lg focus:border-[#2563EB]",
        },
      }}
    >
      <AuthTokenSetter />
      {children}
    </ClerkProvider>
  );
}
