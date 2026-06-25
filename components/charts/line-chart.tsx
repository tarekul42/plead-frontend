"use client";

import { LineChart as RechartsLine, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

export function LineChart({ data, color = "#2563EB" }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLine data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.4} />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </RechartsLine>
    </ResponsiveContainer>
  );
}
