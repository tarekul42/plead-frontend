"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SectionHeader } from "@/components/landing/section-header";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "match",
    icon: Sparkles,
    title: "AI Lead-Property Matching",
    tab: "Match",
    description: "Automatically score and rank every lead against your property inventory.",
    highlights: ["Real-time scoring", "Natural language reasons", "Rule-based fallback"],
    visual: {
      lead: { name: "Sarah J.", budget: "$850K", location: "Brooklyn" },
      property: { title: "Modern 3BR in Brooklyn", price: "$850,000" },
      score: 92,
      reason: "Matches budget, location preference, and bedroom count",
    },
  },
  {
    id: "write",
    icon: FileText,
    title: "AI Marketing Copy",
    tab: "Write",
    description: "Generate compelling property descriptions and personalized lead outreach emails.",
    highlights: ["Property descriptions", "Outreach emails", "Multiple tones"],
    visual: {
      subject: "Your dream home in Brooklyn is available",
      preview:
        "Hi Sarah, I found a stunning 3-bedroom apartment in Brooklyn that matches your criteria perfectly...",
      tone: "Professional",
    },
  },
  {
    id: "analyze",
    icon: BarChart3,
    title: "Smart Analytics",
    tab: "Analyze",
    description: "Track your pipeline performance with real-time analytics and AI insights.",
    highlights: ["Pipeline insights", "Agent metrics", "Conversion tracking"],
    visual: {
      metrics: [
        { label: "Conversion Rate", value: "34%", trend: "+12%" },
        { label: "Avg Close Time", value: "18 days", trend: "-5 days" },
        { label: "Active Leads", value: "127", trend: "+23" },
      ],
    },
  },
];

function MatchVisual({ visual }: { visual: (typeof features)[0]["visual"] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Lead</p>
            <p className="text-sm font-semibold">{visual?.lead?.name}</p>
            <p className="text-xs text-muted">
              Budget: {visual?.lead?.budget} · {visual?.lead?.location}
            </p>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            {visual?.score}% match
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-success/20 bg-success/5 p-4">
        <p className="mb-1 text-xs font-medium text-success">Why this match?</p>
        <p className="text-sm text-muted">{visual?.reason}</p>
      </div>
      <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm">
        <p className="text-xs text-muted">Matched Property</p>
        <p className="text-sm font-medium">{visual?.property?.title}</p>
        <p className="text-xs text-muted">{visual?.property?.price}</p>
      </div>
    </div>
  );
}

function WriteVisual({ visual }: { visual: (typeof features)[1]["visual"] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
            PL
          </div>
          <div>
            <p className="text-xs text-muted">AI-Generated Outreach</p>
            <p className="text-sm font-medium">To: Sarah J.</p>
          </div>
        </div>
        <p className="mb-2 text-sm font-medium">{visual.subject}</p>
        <p className="text-xs leading-relaxed text-muted">{visual.preview}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
            {visual.tone}
          </span>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Personalized
          </span>
        </div>
      </div>
    </div>
  );
}

function AnalyzeVisual({ visual }: { visual: (typeof features)[2]["visual"] }) {
  return (
    <div className="space-y-3">
      {visual?.metrics?.map((m) => (
        <div
          key={m.label}
          className="flex items-center justify-between rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm"
        >
          <div>
            <p className="text-xs text-muted">{m.label}</p>
            <p className="text-lg font-bold">{m.value}</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {m.trend}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AiFeaturesShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const active = features[activeTab];

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="AI-Powered Features"
          title="Work smarter, not harder"
          subtitle="Three powerful AI tools built into your workflow."
        />

        {/* Tab bar */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex gap-1 rounded-xl border border-border bg-background p-1">
            {features.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                  activeTab === i ? "text-brand" : "text-muted hover:text-foreground"
                }`}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="ai-tab"
                    className="absolute inset-0 rounded-lg bg-brand/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <f.icon className="relative h-4 w-4" />
                <span className="relative">{f.tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
          >
            {/* Text side */}
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                <active.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">{active.title}</h3>
              <p className="mb-6 text-muted leading-relaxed">{active.description}</p>
              <div className="mb-8 flex flex-wrap gap-2">
                {active.highlights.map((h) => (
                  <span
                    key={h}
                    className="flex items-center gap-1 rounded-full bg-success/5 px-3 py-1 text-xs font-medium text-success"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {h}
                  </span>
                ))}
              </div>
              <Link href="/sign-up">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Try {active.tab} Feature
                </Button>
              </Link>
            </div>

            {/* Visual side */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              {activeTab === 0 && (
                <MatchVisual visual={active.visual as (typeof features)[0]["visual"]} />
              )}
              {activeTab === 1 && (
                <WriteVisual visual={active.visual as (typeof features)[1]["visual"]} />
              )}
              {activeTab === 2 && (
                <AnalyzeVisual visual={active.visual as (typeof features)[2]["visual"]} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
