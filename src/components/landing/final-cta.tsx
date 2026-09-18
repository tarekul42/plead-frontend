"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-1 to-primary-2 px-6 py-20 text-center text-white shadow-xl sm:px-12 md:py-28"
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-success/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to close your next deal?</h2>
            <p className="mx-auto mb-8 max-w-lg text-lg text-white/70">
              Join thousands of agents who are closing deals faster with AI-powered lead matching.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
                Start free
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Have questions?
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Cancel anytime
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
