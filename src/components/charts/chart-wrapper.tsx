"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LineChart = dynamic(() => import("@/components/charts/line-chart").then((m) => ({ default: m.LineChart })), {
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
  ssr: false,
});

const PieChart = dynamic(() => import("@/components/charts/pie-chart").then((m) => ({ default: m.PieChart })), {
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
  ssr: false,
});

const BarChart = dynamic(() => import("@/components/charts/bar-chart").then((m) => ({ default: m.BarChart })), {
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
  ssr: false,
});

export { LineChart, PieChart, BarChart };
