"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { useLeads } from "@/lib/queries/use-leads";
import { Building2, Users, TrendingUp, MessageSquare, Sparkles, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export default function DashboardPage() {
  const { role } = useCurrentUser();

  if (role === "admin") return <AdminOverview />;
  if (role === "manager") return <ManagerOverview />;
  return <AgentOverview />;
}

function AgentOverview() {
  const { data: leadsData } = useLeads({ limit: 5 });
  const { data: leaderboard } = useQuery({ queryKey: ["lead-stats"], queryFn: () => apiClient.get("/leads/stats").then(r => r.data.data) });

  const leadStatuses = leadsData?.data || [];
  const statusCounts: Record<string, number> = {};
  leadStatuses.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Agent Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Leads" value={leadStatuses.length || 0} icon={Users} />
        <StatCard title="Properties" value="0" icon={Building2} description="Assigned to you" />
        <StatCard title="Interactions" value="0" icon={MessageSquare} description="This week" />
        <StatCard title="Leads Won" value="0" icon={TrendingUp} description="This month" trend={{ value: "12% vs last month", positive: true }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Leads Over Time</h3>
          <div className="h-64">
            <LineChart
              data={[
                { label: "Week 1", value: 4 },
                { label: "Week 2", value: 7 },
                { label: "Week 3", value: 5 },
                { label: "Week 4", value: 9 },
              ]}
            />
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Lead Status</h3>
          <div className="h-64">
            <PieChart
              data={[
                { name: "New", value: statusCounts["new"] || 5 },
                { name: "Contacted", value: statusCounts["contacted"] || 3 },
                { name: "Qualified", value: statusCounts["qualified"] || 2 },
                { name: "Won", value: statusCounts["won"] || 1 },
                { name: "Lost", value: statusCounts["lost"] || 2 },
              ]}
            />
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Interactions This Week</h3>
          <div className="h-64">
            <BarChart
              data={[
                { label: "Mon", value: 3 },
                { label: "Tue", value: 5 },
                { label: "Wed", value: 2 },
                { label: "Thu", value: 7 },
                { label: "Fri", value: 4 },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Recent Leads</h3>
        {leadStatuses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Budget</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leadStatuses.slice(0, 5).map((lead: any) => (
                  <tr key={lead._id} className="border-b border-border last:border-0">
                    <td className="py-3">{lead.name}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#2563EB]/5 px-2 py-0.5 text-xs text-[#2563EB]">{lead.status}</span>
                    </td>
                    <td className="py-3 text-muted">{lead.budget ? `$${(lead.budget / 1000).toFixed(0)}K` : "-"}</td>
                    <td className="py-3 text-muted">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted">No leads yet. Start by adding your first lead.</p>
        )}
      </div>
    </div>
  );
}

function ManagerOverview() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Manager Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Agency Leads" value="0" icon={Users} description="All active leads" />
        <StatCard title="Agency Properties" value="0" icon={Building2} />
        <StatCard title="Team Agents" value="0" icon={Shield} />
        <StatCard title="Avg Close Time" value="N/A" icon={TrendingUp} description="Lead-to-close" />
      </div>
      <div className="mt-8 rounded-card border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-sm font-semibold">Team Performance</h3>
        <p className="mt-4 text-center text-sm text-muted">Add agents to see performance data.</p>
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="0" icon={Users} />
        <StatCard title="Properties" value="0" icon={Building2} />
        <StatCard title="AI Usage" value="0" icon={Sparkles} description="Generations today" />
        <StatCard title="Active Agencies" value="0" icon={Shield} />
      </div>
    </div>
  );
}
