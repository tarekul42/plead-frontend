"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";

import { SectionHeader } from "@/components/landing/section-header";
import { type Testimonial, useTestimonials } from "@/lib/queries/use-public";

const avatarGradients = [
  "from-brand to-brand-dark",
  "from-success to-success-light",
  "from-warning to-warning-light",
  "from-purple-500 to-purple-600",
  "from-rose-500 to-rose-600",
];

export function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const testimonials = data ?? [];
  const [current, setCurrent] = useState(0);

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            title="Trusted by agents"
            subtitle="Hear from real estate professionals."
          />
          <div className="mx-auto max-w-2xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by agents everywhere"
          subtitle="Hear from real estate professionals who use PropLead daily."
        />

        <div className="relative mx-auto max-w-2xl">
          {/* Quote icon */}
          <Quote className="absolute -left-4 -top-4 h-12 w-12 text-brand/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-8 md:p-12"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (testimonials[current]?.rating ?? 0) ? "fill-warning text-warning" : "text-neutral-200"}`}
                  />
                ))}
              </div>

              <p className="mb-8 text-lg leading-relaxed text-foreground">
                &ldquo;{testimonials[current]?.content}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[current % avatarGradients.length]}`}
                >
                  {testimonials[current]?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{testimonials[current]?.name}</p>
                  <p className="text-sm text-muted">{testimonials[current]?.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:border-brand/30"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_: Testimonial, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition ${
                    i === current ? "w-6 bg-brand" : "w-2 bg-neutral-200"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:border-brand/30"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
