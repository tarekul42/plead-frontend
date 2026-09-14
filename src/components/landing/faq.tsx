"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does the AI matching engine work?", a: "The AI analyzes lead criteria (budget, location, beds desired) against your property inventory using structured scoring. It returns a match score (0-100) with specific reasons for each recommendation." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. Each agency's data is fully isolated from others. We never share or sell your data. Read our privacy policy for details." },
  { q: "What AI providers do you use?", a: "We use Google Gemini 1.5 Flash as our primary provider with Groq (Llama 3.1) as a fallback. Both are free-tier providers, ensuring we can offer AI features without passing costs to you." },
  { q: "Can I try before committing?", a: "Absolutely. Start with a free account and explore all features. No credit card required. You can manage up to 50 properties and 200 leads on the free plan." },
  { q: "How accurate is the lead scoring?", a: "The AI achieves over 85% accuracy when compared to expert agent assessments. Scores are based on concrete data points (budget, location, beds, baths) and every reason references specific field values." },
  { q: "Do you support multiple agents per agency?", a: "Yes. PropLead is built for teams. Managers can view all team activity, assign leads, and track performance. Admins can manage users and roles across the entire agency." },
  { q: "What if the AI is unavailable?", a: "The system automatically falls back to a deterministic rule-based scoring engine. You'll always get match results, even if the AI providers are temporarily down." },
  { q: "Can I export my data?", a: "Yes. You can export all your leads, properties, and interactions at any time. We believe in data portability — your data belongs to you." },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted">Everything you need to know</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-card border border-border bg-surface shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium pr-4">{faq.q}</span>
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
                      {faq.a}
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
