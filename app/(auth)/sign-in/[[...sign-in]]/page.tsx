import { SignIn } from "@clerk/nextjs";
import { DemoLoginButtons } from "@/components/common/demo-login-buttons";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to your account to continue</p>
      </div>

      <DemoLoginButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted font-medium">
            Or sign in with email
          </span>
        </div>
      </div>

      <SignIn
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
            identityPreviewText: "text-foreground",
            identityPreviewEditButton: "text-brand",
            dividerLine: "hidden",
            dividerText: "hidden",
            alternativeMethodsBlockButton:
              "border border-border rounded-lg hover:bg-neutral-100 dark:hover:bg-surface-alt text-foreground font-medium",
          },
        }}
      />
    </div>
  );
}
