"use client";

import { motion } from "framer-motion";
import { Search, Cpu, Handshake } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Capture Leads",
    description: "Import leads from your website, social media, or manually. All lead data is organized and ready.",
  },
  {
    icon: Cpu,
    title: "AI Matches Properties",
    description: "Our AI engine scores each lead against your inventory based on budget, location, and preferences.",
  },
  {
    icon: Handshake,
    title: "Close Deals Faster",
    description: "Send personalized outreach, schedule viewings, and track every interaction until the deal closes.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">How It Works</h2>
          <p className="mt-2 text-muted">Three simple steps to transform your workflow</p>
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full border-t border-dashed border-border md:-right-1/2 md:block" />
              )}
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/5">
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {i + 1}
                </span>
                <step.icon className="h-7 w-7 text-brand" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
