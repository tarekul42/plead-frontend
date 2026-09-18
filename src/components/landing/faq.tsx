"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useFaq, type FaqItem } from "@/lib/queries/use-public";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data, isLoading } = useFaq();
  const faqs = data ?? [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted">Everything you need to know</p>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-card border border-border bg-surface"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted">Everything you need to know</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq: FaqItem, i: number) => (
            <div
              key={faq._id ?? i}
              className="rounded-card border border-border bg-surface shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-border px-6 py-4 text-sm text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
