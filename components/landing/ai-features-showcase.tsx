"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Lead-Property Matching",
    description: "Automatically score and rank every lead against your property inventory. Get match scores (0-100), detailed reasons, and suggested next actions.",
    highlights: ["Real-time scoring", "Natural language reasons", "Rule-based fallback"],
  },
  {
    icon: FileText,
    title: "AI Marketing Copy Generator",
    description: "Generate compelling property descriptions and personalized lead outreach emails in seconds. Choose from multiple tones and styles.",
    highlights: ["Property descriptions", "Outreach emails", "Multiple tones"],
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
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-card border border-border bg-background p-8 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563EB]/5">
                <feature.icon className="h-6 w-6 text-[#2563EB]" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="mb-6 text-sm text-muted leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-[#10B981]/5 px-3 py-1 text-xs font-medium text-[#10B981]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
