"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

const helpTopics = [
  { q: "How do I get started?", a: "Sign up for a free account, set up your agency profile, and start adding properties. It takes about 5 minutes to get started." },
  { q: "How do I add a property?", a: "Navigate to Dashboard → Properties → Add Property. Fill in the details, upload images, and click Save. You can also use the AI Description Generator to create compelling copy." },
  { q: "How does AI lead matching work?", a: "Open any lead and click 'Match Properties'. The AI scores your property inventory against the lead's criteria (budget, location, beds) and returns ranked results with reasons." },
  { q: "Can I import leads?", a: "You can manually add leads from the dashboard. Bulk import is coming soon. For now, you can use the Lead form to enter lead details one at a time." },
  { q: "How do I manage my team?", a: "Admins can invite team members and assign roles (Agent, Manager). Managers can view all activity and reassign leads. Go to Dashboard → Users to manage." },
  { q: "Is there a mobile app?", a: "PropLead is fully responsive and works great on mobile browsers. A native mobile app is on the roadmap." },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = helpTopics.filter(
    (t) =>
      t.q.toLowerCase().includes(search.toLowerCase()) ||
      t.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Help Center</h1>
        <p className="mb-8 text-muted">Find answers to common questions</p>
        <div className="relative mx-auto max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((topic, i) => (
          <div key={i} className="rounded-card border border-border bg-surface shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium pr-4">{topic.q}</span>
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
                    {topic.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted">
            No results found. Try different keywords, or{" "}
            <Link href="/contact" className="text-brand hover:underline">
              contact support
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
