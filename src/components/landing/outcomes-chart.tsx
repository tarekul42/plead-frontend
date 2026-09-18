"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { SectionHeader } from "@/components/landing/section-header";

const data = [
  { month: "Jan", before: 90, after: 47 },
  { month: "Feb", before: 85, after: 45 },
  { month: "Mar", before: 88, after: 42 },
  { month: "Apr", before: 82, after: 40 },
  { month: "May", before: 78, after: 38 },
  { month: "Jun", before: 75, after: 35 },
];

export function OutcomesChart() {
  return (
    <section className="section-padding bg-section-alt">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Proven results"
          title="Close deals faster with AI"
          subtitle="Agencies using PropLead see dramatic improvements in their pipeline."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Before/After comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Before card */}
              <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-danger">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">Without PropLead</span>
                </div>
                <p className="text-3xl font-bold">90 days</p>
                <p className="mt-1 text-sm text-muted">Average lead-to-close time</p>
              </div>

              {/* After card */}
              <div className="rounded-2xl border border-success/20 bg-success/5 p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">With PropLead</span>
                </div>
                <p className="text-3xl font-bold">47 days</p>
                <p className="mt-1 text-sm text-muted">Average lead-to-close time</p>
              </div>
            </div>

            {/* Callout */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
              <Zap className="h-5 w-5 text-brand" />
              <p className="text-sm">
                <span className="font-semibold text-brand">48% faster</span> average close time
                across all agencies using PropLead.
              </p>
            </div>
          </motion.div>

          {/* Right: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-background p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-danger" />
                Before
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-success" />
                After (PropLead)
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={4}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    opacity={0.4}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    opacity={0.4}
                    label={{
                      value: "Days to Close",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12, fill: "currentColor", opacity: 0.6 },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="before"
                    fill="var(--color-danger)"
                    radius={[4, 4, 0, 0]}
                    name="Before"
                  />
                  <Bar
                    dataKey="after"
                    fill="var(--color-success)"
                    radius={[4, 4, 0, 0]}
                    name="After (PropLead)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
