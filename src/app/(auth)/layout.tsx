import Link from "next/link";
import { Sparkles, TrendingUp, Users, Shield, Quote } from "lucide-react";

const benefits = [
  { icon: Sparkles, value: "AI-Powered", label: "Smart lead matching" },
  { icon: TrendingUp, value: "3x Faster", label: "Close more deals" },
  { icon: Users, value: "24/7", label: "Automated outreach" },
  { icon: Shield, value: "Secure", label: "Enterprise-grade" },
];

const testimonials = [
  {
    quote: "PropLead cut our lead-to-deal time in half. The AI matching is incredible.",
    author: "Sarah Chen",
    title: "Real Estate Agent, Homelink Realty",
  },
  {
    quote: "We closed 40% more deals in the first month. Can't imagine working without it.",
    author: "Marcus Johnson",
    title: "Broker, Prime Properties",
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
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
          <h2 className="mb-2 text-3xl font-bold">PropLead AI</h2>
          <p className="mb-10 text-lg text-muted">
            The all-in-one platform for real estate agents to match, convert, and close more deals.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.label}
                className="rounded-xl border border-border bg-surface/50 p-4 text-center backdrop-blur-sm transition hover:bg-surface/80"
              >
                <benefit.icon className="mx-auto mb-1.5 h-5 w-5 text-brand" />
                <p className="text-base font-bold">{benefit.value}</p>
                <p className="text-xs text-muted">{benefit.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="rounded-xl border border-border bg-surface/30 p-4 text-left backdrop-blur-sm"
              >
                <Quote className="mb-1 h-4 w-4 text-brand/40" />
                <p className="text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-2 text-xs text-foreground/70">
                  <span className="font-semibold">{t.author}</span>
                  <span className="text-muted"> &mdash; {t.title}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
