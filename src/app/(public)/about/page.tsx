import { ArrowRight, CheckCircle2, Lightbulb, Shield, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

import { GradientDivider } from "@/components/landing/gradient-divider";
import { SectionHeader } from "@/components/landing/section-header";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Empower real estate agents with AI tools that automate lead matching, so they can focus on closing deals — not data entry.",
    gradient: "from-brand/8 to-brand/3",
  },
  {
    icon: Users,
    title: "Built for Teams",
    text: "Whether you're a solo agent or a 50-person agency, PropLead scales with you. Multi-tenant by design, simple by choice.",
    gradient: "from-brand/6 to-brand/2",
  },
  {
    icon: Lightbulb,
    title: "AI-First",
    text: "We believe AI should be a practical daily tool, not a gimmick. Every feature is designed to save real time and deliver measurable results.",
    gradient: "from-accent/8 to-accent/3",
  },
  {
    icon: Shield,
    title: "Privacy First",
    text: "Your data belongs to you. We never train on your data, never share it, and never lock you in. Export anytime.",
    gradient: "from-brand/10 to-accent/5",
  },
];

const milestones = [
  { year: "2024", event: "Founded with a vision to democratize AI for real estate" },
  { year: "2025", event: "Launched beta with AI Match Engine and multi-tenant architecture" },
  { year: "2026", event: "Public launch — free for all real estate professionals" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-grid py-20 md:py-28">
        <div className="bg-gradient-hero pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand">
            <Zap className="h-4 w-4" />
            Our Story
          </span>
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl">
            Built by agents, <span className="text-gradient-brand">for agents</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted leading-relaxed">
            PropLead AI is the first completely free AI-powered lead engine purpose-built for real
            estate agents. We combine modern CRM capabilities with cutting-edge AI to help agents
            match leads to properties, generate marketing copy, and close deals faster — all at zero
            cost.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Why We Built This */}
        <section className="py-16 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Why we built this"
                title="Real estate is personal. Our AI makes it scalable."
                align="left"
                className="mb-6"
              />
              <p className="mb-4 text-muted leading-relaxed">
                Real estate agents spend too much time on manual tasks — sorting spreadsheets,
                writing listing descriptions, and manually matching leads to properties. We believed
                AI could change that.
              </p>
              <p className="mb-8 text-muted leading-relaxed">
                PropLead was built to automate the tedious parts of lead management while keeping
                agents in control. Our AI handles the heavy lifting — scoring leads, matching
                properties, generating copy — so you can focus on what matters: building
                relationships and closing deals.
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
            <div className="gradient-border rounded-2xl bg-surface p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold">By the Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gradient-brand text-3xl font-bold">$0</p>
                  <p className="text-sm text-muted">Cost to use</p>
                </div>
                <div>
                  <p className="text-gradient-brand text-3xl font-bold">85%+</p>
                  <p className="text-sm text-muted">AI match accuracy</p>
                </div>
                <div>
                  <p className="text-gradient-brand text-3xl font-bold">5 min</p>
                  <p className="text-sm text-muted">Setup time</p>
                </div>
                <div>
                  <p className="text-gradient-brand text-3xl font-bold">24/7</p>
                  <p className="text-sm text-muted">AI availability</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GradientDivider />

        {/* Values */}
        <section className="py-16 md:py-20">
          <SectionHeader
            eyebrow="Our values"
            title="What drives us"
            subtitle="The principles behind every feature we build."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className={`glow-card rounded-card border border-border bg-gradient-to-br p-8 ${v.gradient}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 shadow-sm">
                  <v.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <GradientDivider />

        {/* Timeline */}
        <section className="py-16 md:py-20">
          <SectionHeader eyebrow="Our journey" title="From idea to launch" />
          <div className="mx-auto max-w-2xl">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-sm font-bold text-white shadow-lg">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="mt-2 h-full w-px bg-gradient-to-b from-brand/30 to-accent/30" />
                  )}
                </div>
                <div className="pb-12">
                  <p className="text-sm font-semibold text-brand">{m.year}</p>
                  <p className="mt-1 text-muted">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="rounded-2xl bg-gradient-cta px-8 py-16 text-center text-white shadow-xl md:px-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mb-8 max-w-lg text-lg text-white/70">
              Join real estate professionals who are closing deals faster with AI.
            </p>
            <Link href="/sign-up">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start Free
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
