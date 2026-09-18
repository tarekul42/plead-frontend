import Link from "next/link";
import { Target, Users, Lightbulb, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Empower real estate agents with AI tools that automate lead matching, so they can focus on closing deals — not data entry.",
  },
  {
    icon: Users,
    title: "Built for Teams",
    text: "Whether you're a solo agent or a 50-person agency, PropLead scales with you. Multi-tenant by design, simple by choice.",
  },
  {
    icon: Lightbulb,
    title: "AI-First",
    text: "We believe AI should be a practical daily tool, not a gimmick. Every feature is designed to save real time and deliver measurable results.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    text: "Your data belongs to you. We never train on your data, never share it, and never lock you in. Export anytime.",
  },
];

const milestones = [
  { year: "2024", event: "Founded with a vision to democratize AI for real estate" },
  { year: "2025", event: "Launched beta with AI Match Engine and multi-tenant architecture" },
  { year: "2026", event: "Public launch — free for all real estate professionals" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">About PropLead AI</h1>
        <p className="text-lg text-muted leading-relaxed">
          PropLead AI is the first completely free AI-powered lead engine purpose-built for real
          estate agents. We combine modern CRM capabilities with cutting-edge AI to help agents
          match leads to properties, generate marketing copy, and close deals faster — all at zero
          cost.
        </p>
      </div>

      {/* Why We Built This */}
      <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Why We Built PropLead</h2>
          <p className="mb-4 text-muted leading-relaxed">
            Real estate agents spend too much time on manual tasks — sorting spreadsheets, writing
            listing descriptions, and manually matching leads to properties. We believed AI could
            change that.
          </p>
          <p className="mb-6 text-muted leading-relaxed">
            PropLead was built to automate the tedious parts of lead management while keeping agents
            in control. Our AI handles the heavy lifting — scoring leads, matching properties,
            generating copy — so you can focus on what matters: building relationships and closing
            deals.
          </p>
          <div className="space-y-3">
            {[
              "100% free core platform",
              "AI-powered lead matching",
              "No credit card required",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold">By the Numbers</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-brand">0</p>
              <p className="text-sm text-muted">Cost to use</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success">85%+</p>
              <p className="text-sm text-muted">AI match accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning">5 min</p>
              <p className="text-sm text-muted">Setup time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-danger">24/7</p>
              <p className="text-sm text-muted">AI availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-card border border-border bg-surface p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/5">
                <v.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Our Journey</h2>
        <div className="mx-auto max-w-2xl space-y-8">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {m.year.slice(2)}
                </div>
                {i < milestones.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
              </div>
              <div className="pb-8">
                <p className="text-sm font-semibold text-brand">{m.year}</p>
                <p className="mt-1 text-muted">{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 rounded-card border border-border bg-surface p-12 text-center shadow-sm">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to get started?</h2>
        <p className="mb-8 text-muted">
          Join real estate professionals who are closing deals faster with AI.
        </p>
        <Link href="/sign-up">
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Start Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
