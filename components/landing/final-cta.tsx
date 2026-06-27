"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
          <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
            Start free
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Talk to sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
