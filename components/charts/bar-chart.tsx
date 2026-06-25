"use client";

import { BarChart as RechartsBar, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

export function BarChart({ data, color = "#2563EB" }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBar data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
