"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-container overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm text-brand">
            <Sparkles className="h-4 w-4" />
            AI-Powered Real Estate Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          Close more deals with
          <br />
          <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
            AI-powered lead matching
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted"
        >
          Match the right lead to the right property in seconds — not hours.
          Automate outreach, generate marketing copy, and track your pipeline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/sign-up"
            className="rounded-lg bg-brand px-8 py-3 text-white shadow-lg shadow-[#2563EB]/20 transition hover:opacity-90"
          >
            Start free
          </Link>
          <Link
            href="/properties"
            className="rounded-lg border border-border px-8 py-3 transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Explore properties
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex justify-center"
      >
        <div className="relative h-64 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-gradient-to-b from-neutral-100/50 to-surface dark:from-[#1E293B]/50 dark:to-[#0F172A] shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid w-full max-w-lg gap-3 px-6">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10" />
                  <div>
                    <p className="text-sm font-medium">Modern 3BR in Brooklyn</p>
                    <p className="text-xs text-muted">Lead: Sarah J. • Budget: $850K</p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  92% Match
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand/10" />
                  <div>
                    <p className="text-sm font-medium">Luxury Condo, Manhattan</p>
                    <p className="text-xs text-muted">Lead: Mark T. • Budget: $1.2M</p>
                  </div>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  85% Match
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-warning/10" />
                  <div>
                    <p className="text-sm font-medium">Cozy Studio, Downtown</p>
                    <p className="text-xs text-muted">Lead: Emily R. • Budget: $400K</p>
                  </div>
                </div>
                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                  71% Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex justify-center"
      >
        <ArrowDown className="h-6 w-6 animate-bounce text-muted" />
      </motion.div>
    </section>
  );
}
