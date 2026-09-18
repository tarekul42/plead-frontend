"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, FileText, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Lead-Property Matching",
    description:
      "Automatically score and rank every lead against your property inventory. Get match scores (0-100), detailed reasons, and suggested next actions.",
    highlights: ["Real-time scoring", "Natural language reasons", "Rule-based fallback"],
  },
  {
    icon: FileText,
    title: "AI Marketing Copy Generator",
    description:
      "Generate compelling property descriptions and personalized lead outreach emails in seconds. Choose from multiple tones and styles.",
    highlights: ["Property descriptions", "Outreach emails", "Multiple tones"],
  },
  {
    icon: BarChart3,
    title: "Smart Analytics Dashboard",
    description:
      "Track your pipeline performance with real-time analytics. See which lead sources convert best, monitor agent performance, and identify trends.",
    highlights: ["Pipeline insights", "Agent metrics", "Conversion tracking"],
  },
];

export function AiFeaturesShowcase() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">AI-Powered Features</h2>
          <p className="mt-2 text-muted">Work smarter, not harder</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-card border border-border bg-background p-8 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/5">
                <feature.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="mb-6 text-sm text-muted leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-success/5 px-3 py-1 text-xs font-medium text-success"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/sign-up">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Try AI Features Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
