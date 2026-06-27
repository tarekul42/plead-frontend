"use client";

import { Sparkles, Zap, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { PieChart } from "@/components/charts/pie-chart";

const usageData = [
  { label: "Mon", value: 24 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 31 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 27 },
  { label: "Sat", value: 8 },
  { label: "Sun", value: 5 },
];

const typeData = [
  { name: "Lead Match", value: 45 },
  { name: "Description", value: 32 },
  { name: "Outreach Email", value: 23 },
];

const recentGenerations = [
  { id: "1", type: "Lead Match", user: "Sarah M.", status: "success", duration: "1.2s", tokens: 245, date: "2 min ago" },
  { id: "2", type: "Description", user: "James C.", status: "success", duration: "2.1s", tokens: 512, date: "15 min ago" },
  { id: "3", type: "Outreach Email", user: "Emily R.", status: "success", duration: "1.8s", tokens: 389, date: "1 hour ago" },
  { id: "4", type: "Lead Match", user: "Sarah M.", status: "success", duration: "0.9s", tokens: 198, date: "2 hours ago" },
  { id: "5", type: "Description", user: "Michael P.", status: "error", duration: "3.4s", tokens: 0, date: "3 hours ago" },
];

export default function AiUsagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Usage Analytics</h1>
        <p className="text-sm text-muted">Track AI feature adoption and performance</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Generations" value="135" icon={Sparkles} description="This week" />
        <StatCard title="Avg Response" value="1.8s" icon={Zap} description="Across all providers" />
        <StatCard title="Tokens Used" value="1,892" icon={Clock} description="This week" trend={{ value: "12% vs last week", positive: true }} />
        <StatCard title="Success Rate" value="98.5%" icon={CheckCircle} description="200 total requests" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Generations Per Day</h3>
          <div className="h-64">
            <LineChart data={usageData} color="var(--color-success)" />
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">By Type</h3>
          <div className="h-64">
            <PieChart data={typeData} />
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        <h3 className="p-4 text-sm font-semibold border-b border-border">Recent Generations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Tokens</th>
                <th className="p-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentGenerations.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50">
                  <td className="p-4">{g.type}</td>
                  <td className="p-4 text-muted">{g.user}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      g.status === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{g.duration}</td>
                  <td className="p-4 text-muted">{g.tokens || "-"}</td>
                  <td className="p-4 text-muted">{g.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
