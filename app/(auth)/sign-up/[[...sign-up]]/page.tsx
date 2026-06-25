import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
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
  );
}
