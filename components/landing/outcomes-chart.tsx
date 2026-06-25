"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

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
    <section className="py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Measurable Results
            </h2>
            <p className="mb-6 text-muted">
              Agencies using PropLead see a dramatic reduction in lead-to-close time.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="flex items-center gap-2 text-sm text-danger">
                  <TrendingDown className="h-4 w-4" />
                  <span>Before</span>
                </div>
                <p className="text-3xl font-bold">90 days</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span>After</span>
                </div>
                <p className="text-3xl font-bold">47 days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
                <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="before" fill="#EF4444" radius={[4, 4, 0, 0]} name="Before" />
                <Bar dataKey="after" fill="#10B981" radius={[4, 4, 0, 0]} name="After (PropLead)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
