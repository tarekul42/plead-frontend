import Link from "next/link";
import { Sparkles, TrendingUp, Users, Shield } from "lucide-react";

const benefits = [
  { icon: Sparkles, value: "AI-Powered", label: "Smart lead matching" },
  { icon: TrendingUp, value: "3x Faster", label: "Close more deals" },
  { icon: Users, value: "24/7", label: "Automated outreach" },
  { icon: Shield, value: "Secure", label: "Enterprise-grade" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              PropLead
            </Link>
            <p className="mt-1 text-sm text-muted">
              AI-powered real estate lead engine
            </p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-brand/5 via-background to-success/5 p-12 lg:flex">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold">
            PropLead AI
          </h2>
          <p className="mb-12 text-lg text-muted">
            The all-in-one platform for real estate agents to match, convert, and close more deals.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="rounded-xl border border-border bg-surface/50 p-5 text-center backdrop-blur-sm">
                <benefit.icon className="mx-auto mb-2 h-6 w-6 text-brand" />
                <p className="text-lg font-bold">{benefit.value}</p>
                <p className="text-xs text-muted">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
