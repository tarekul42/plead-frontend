"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Ready to close your next deal?
        </h2>
        <p className="mb-8 text-lg text-muted">
          Join thousands of agents who are closing deals faster with AI-powered lead matching.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#2563EB] px-8 py-3 text-white shadow-lg shadow-[#2563EB]/20 transition hover:opacity-90"
          >
            Start free
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-8 py-3 transition hover:bg-neutral-100 dark:hover:bg-surface"
          >
            Talk to sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
