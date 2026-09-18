"use client";

import { motion } from "framer-motion";
import { Cpu, Handshake, Search } from "lucide-react";

import { SectionHeader } from "@/components/landing/section-header";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Add your leads & properties",
    description: "Import your pipeline and listings in minutes. Our AI gets to work instantly.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI matches them automatically",
    description: "Our engine scores every lead against your inventory and finds the best fits.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Close deals faster",
    description:
      "Get AI-written outreach, track your pipeline, and focus on what matters — relationships.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-section-alt">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to smarter selling"
          subtitle="No complex setup. No training required. Just results."
        />

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-brand/20 via-brand to-brand/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Number circle */}
                  <div className="relative z-10 mx-auto mb-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white text-lg font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
