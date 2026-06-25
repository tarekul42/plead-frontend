"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Properties Listed", value: 1247, suffix: "+" },
  { label: "Leads Tracked", value: 5832, suffix: "+" },
  { label: "AI Matches Made", value: 28491, suffix: "+" },
  { label: "Avg Deal Time", value: 52, prefix: "-", suffix: "%" },
];

function AnimatedCounter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [to]);

  return (
    <span className="text-3xl font-bold md:text-4xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
