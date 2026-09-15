"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockMatches = [
  {
    title: "Modern 3BR in Brooklyn",
    lead: "Sarah J.",
    budget: "$850K",
    score: 92,
    color: "success",
  },
  { title: "Luxury Condo, Manhattan", lead: "Mark T.", budget: "$1.2M", score: 85, color: "brand" },
  {
    title: "Cozy Studio, Downtown",
    lead: "Emily R.",
    budget: "$400K",
    score: 71,
    color: "warning",
  },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-container overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <div className="bg-gradient-hero pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="h-4 w-4" />
            AI-Powered Real Estate Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          Close more deals with{" "}
          <span className="text-gradient-brand">AI-powered lead matching</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted"
        >
          Match the right lead to the right property in seconds — not hours. Automate outreach,
          generate marketing copy, and track your pipeline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/sign-up">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start free
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="secondary" size="lg" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Explore properties
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-muted"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> Free forever plan
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" /> Cancel anytime
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 flex justify-center"
      >
        <div className="glass relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="grid w-full max-w-lg gap-2 sm:gap-3">
              {mockMatches.map((match, i) => (
                <motion.div
                  key={match.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background/60 p-3 sm:p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-${match.color}/10 flex items-center justify-center`}
                    >
                      <div className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-${match.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{match.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted truncate">
                        Lead: {match.lead} &bull; Budget: {match.budget}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full bg-${match.color}/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-${match.color}`}
                  >
                    {match.score}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="mt-10 flex justify-center"
      >
        <ArrowDown className="h-5 w-5 text-muted" />
      </motion.div>
    </section>
  );
}
