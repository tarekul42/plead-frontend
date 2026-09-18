"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTestimonials, type Testimonial } from "@/lib/queries/use-public";

const avatarColors = ["bg-brand/10", "bg-success/10", "bg-warning/10"];

export function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const testimonials = data ?? [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Trusted by Agents</h2>
            <p className="mt-2 text-muted">Hear from real estate professionals</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-card border border-border bg-surface p-6"
              >
                <div className="mb-4 h-8 w-8 rounded bg-muted/20" />
                <div className="mb-2 h-3 w-full rounded bg-muted/20" />
                <div className="mb-4 h-3 w-3/4 rounded bg-muted/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Trusted by Agents</h2>
          <p className="mt-2 text-muted">Hear from real estate professionals</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t: Testimonial, i: number) => {
            const name = t.name;
            const role = t.role;
            const company = (t as unknown as Record<string, unknown>)?.company as
              string | undefined;
            const quote = t.content;
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <motion.div
                key={t._id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-card border border-border bg-surface p-6 shadow-sm"
              >
                <Quote className="mb-4 h-8 w-8 text-brand/20" />
                <p className="mb-6 text-sm leading-relaxed text-muted">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-brand ${avatarColors[i % avatarColors.length]}`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted">
                      {role}
                      {company ? `, ${company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
