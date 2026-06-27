import { SignIn } from "@clerk/nextjs";
import { DemoLoginButtons } from "@/components/common/demo-login-buttons";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <DemoLoginButtons />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted">Or sign in with email</span>
        </div>
      </div>
      <SignIn
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
            identityPreviewText: "text-foreground",
            identityPreviewEditButton: "text-brand",
          },
        }}
      />
    </div>
  );
}
