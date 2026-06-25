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
            card: "shadow-sm border border-border rounded-xl",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted",
            socialButtonsBlockButton: "border border-border hover:bg-neutral-100 dark:hover:bg-surface",
            formButtonPrimary: "bg-[#2563EB] hover:opacity-90",
            formFieldInput: "border border-border rounded-lg focus:border-[#2563EB]",
            footerActionLink: "text-[#2563EB] hover:underline",
          },
        }}
      />
    </div>
  );
}
