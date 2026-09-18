"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles, TrendingDown, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SectionHeader } from "@/components/landing/section-header";
import { usePublicStats } from "@/lib/queries/use-public";

const colorMap: Record<string, string> = {
  brand: "text-brand",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;
    started.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * to));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="text-gradient-brand text-3xl font-bold tracking-tight md:text-4xl">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const { data: statsData } = usePublicStats();

  const stats = [
    {
      label: "Properties Listed",
      value: statsData?.propertiesListed ?? 0,
      suffix: "+",
      icon: Building2,
      color: "brand",
    },
    {
      label: "Leads Tracked",
      value: statsData?.leadsTracked ?? 0,
      suffix: "+",
      icon: Users,
      color: "success",
    },
    {
      label: "AI Matches Made",
      value: statsData?.aiMatchesMade ?? 0,
      suffix: "+",
      icon: Sparkles,
      color: "warning",
    },
    {
      label: "Faster Closes",
      value: Number(statsData?.avgCloseTimeReduction ?? 52),
      prefix: "",
      suffix: "%",
      icon: TrendingDown,
      color: "success",
    },
  ];

  return (
    <section className="section-padding border-y border-border bg-section-alt">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Trusted by agents" title="Results that speak for themselves" />
        <div className="gradient-border rounded-2xl bg-surface p-8 md:p-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5">
                  <stat.icon className={`h-6 w-6 ${colorMap[stat.color] ?? "text-brand"}`} />
                </div>
                <AnimatedCounter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
