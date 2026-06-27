import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "shadow-sm border border-border rounded-xl p-0",
          headerTitle: "text-foreground text-xl font-bold",
          headerSubtitle: "text-muted",
          socialButtonsBlockButton:
            "border border-border rounded-lg hover:bg-neutral-100 dark:hover:bg-surface-alt text-foreground font-medium",
          socialButtonsBlockButtonText: "text-foreground",
          formButtonPrimary:
            "bg-brand hover:bg-brand-dark text-white rounded-lg font-medium shadow-sm transition",
          formFieldInput:
            "rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus-visible:ring-2 focus-visible:ring-brand",
          formFieldLabel: "text-sm font-medium text-foreground",
          footerActionLink: "text-brand hover:underline font-medium",
        },
      }}
    />
  );
}
