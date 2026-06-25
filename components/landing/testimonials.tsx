"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Real Estate Agent, Sterling Realty",
    quote: "PropLead cut my lead-to-close time in half. The AI match engine is like having a second agent working for me 24/7.",
    avatar: "SM",
  },
  {
    name: "James Chen",
    role: "Broker, Pacific Homes",
    quote: "The AI copy generator alone saves me hours every week. Property descriptions that used to take 20 minutes now take 20 seconds.",
    avatar: "JC",
  },
  {
    name: "Maria Rodriguez",
    role: "Agency Owner, Rodriguez Group",
    quote: "We've grown our closed deals by 40% since switching to PropLead. The multi-agent dashboard gives me full visibility into my team.",
    avatar: "MR",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Trusted by Agents</h2>
          <p className="mt-2 text-muted">Hear from real estate professionals</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-card border border-border bg-surface p-6 shadow-sm"
            >
              <Quote className="mb-4 h-8 w-8 text-[#2563EB]/20" />
              <p className="mb-6 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-sm font-semibold text-[#2563EB]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
