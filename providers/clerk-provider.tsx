"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

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
      {children}
    </ClerkProvider>
  );
}
