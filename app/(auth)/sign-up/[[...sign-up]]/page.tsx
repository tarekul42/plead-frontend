import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-muted">Get started with PropLead AI for free</p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0 p-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            header: "hidden",
            socialButtons: "hidden",
            dividerRow: "hidden",
            formButtonPrimary:
              "bg-brand hover:bg-brand-dark text-white rounded-lg font-medium shadow-sm transition",
            formFieldInput:
              "rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus-visible:ring-2 focus-visible:ring-brand transition",
            formFieldLabel: "text-sm font-medium text-foreground",
            footerActionLink: "text-brand hover:underline font-medium",
            dividerLine: "hidden",
            dividerText: "hidden",
          },
        }}
      />
    </div>
  );
}
