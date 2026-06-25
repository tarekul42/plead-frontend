"use client";

import { UserCheck, Home, TrendingUp, Star } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const agents = [
  { name: "Sarah Mitchell", email: "sarah@agency.com", title: "Senior Agent", leads: 24, closed: 8, rate: 33, rating: 4.8 },
  { name: "James Chen", email: "james@agency.com", title: "Agent", leads: 18, closed: 5, rate: 28, rating: 4.5 },
  { name: "Emily Rodriguez", email: "emily@agency.com", title: "Agent", leads: 15, closed: 4, rate: 27, rating: 4.3 },
  { name: "Michael Park", email: "michael@agency.com", title: "Junior Agent", leads: 10, closed: 2, rate: 20, rating: 4.0 },
];

export default function AgentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Team Performance</h1>
        <p className="text-sm text-muted">Monitor your team&apos;s performance metrics</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Agents" value={agents.length} icon={UserCheck} />
        <StatCard title="Total Leads" value={agents.reduce((s, a) => s + a.leads, 0)} icon={Home} />
        <StatCard title="Total Closed" value={agents.reduce((s, a) => s + a.closed, 0)} icon={TrendingUp} />
        <StatCard title="Avg Rating" value={(agents.reduce((s, a) => s + a.rating, 0) / agents.length).toFixed(1)} icon={Star} />
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="p-4 font-medium">Agent</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Leads</th>
                <th className="p-4 font-medium">Closed</th>
                <th className="p-4 font-medium">Conversion</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.name} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-[#1E293B]/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted">{agent.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{agent.title}</td>
                  <td className="p-4">{agent.leads}</td>
                  <td className="p-4">{agent.closed}</td>
                  <td className="p-4">
                    <span className={`font-medium ${agent.rate >= 30 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                      {agent.rate}%
                    </span>
                  </td>
                  <td className="p-4">{agent.rating.toFixed(1)}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-[#10B981]/10 px-2.5 py-0.5 text-xs font-medium text-[#10B981]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
