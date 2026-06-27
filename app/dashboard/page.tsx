"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { DashboardLoading } from "@/components/common/dashboard-loading";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { useLeads } from "@/lib/queries/use-leads";
import { useProperties } from "@/lib/queries/use-properties";
import { Building2, Users, TrendingUp, MessageSquare, Sparkles, Shield, Star, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export default function DashboardPage() {
  const { role } = useCurrentUser();

  if (role === "admin") return <AdminOverview />;
  if (role === "manager") return <ManagerOverview />;
  return <AgentOverview />;
}

function AgentOverview() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeads({ limit: 5 });
  const { data: leaderboard, isLoading: statsLoading } = useQuery({ queryKey: ["lead-stats"], queryFn: () => apiClient.get("/leads/stats").then(r => r.data.data) });

  const leadStatuses = leadsData?.data || [];
  const statusCounts: Record<string, number> = {};
  leadStatuses.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  if (leadsLoading || statsLoading) {
    return <DashboardLoading />;
  }

  if (leadsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => refetchLeads()} />;
  }

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
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Budget</th>
                  <th className="p-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leadStatuses.slice(0, 5).map((lead: any) => (
                  <tr key={lead._id} className="border-b border-border last:border-0">
                    <td className="p-4">{lead.name}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-brand/5 px-2.5 py-0.5 text-xs font-medium text-brand">{lead.status}</span>
                    </td>
                    <td className="p-4 text-muted">{lead.budget ? `$${(lead.budget / 1000).toFixed(0)}K` : "-"}</td>
                    <td className="p-4 text-muted">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No leads yet" message="Start by adding your first lead." />
        )}
      </div>
    </div>
  );
}

function ManagerOverview() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeads({ limit: 100 });
  const { data: propsData, isLoading: propsLoading, isError: propsError, refetch: refetchProps } = useProperties({ limit: 100 });
  const leads = leadsData?.data || [];
  const properties = propsData?.data || [];

  if (leadsLoading || propsLoading) {
    return <DashboardLoading />;
  }

  if (leadsError || propsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => { refetchLeads(); refetchProps(); }} />;
  }

  const agentsLeaderboard = [
    { name: "Sarah Mitchell", leads: 24, closed: 8, rate: 33 },
    { name: "James Chen", leads: 18, closed: 5, rate: 28 },
    { name: "Emily Rodriguez", leads: 15, closed: 4, rate: 27 },
    { name: "Michael Park", leads: 10, closed: 2, rate: 20 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Manager Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Agency Leads" value={leads.length} icon={Users} description="All active leads" />
        <StatCard title="Agency Properties" value={properties.length} icon={Building2} />
        <StatCard title="Team Agents" value={4} icon={Shield} />
        <StatCard title="Avg Close Time" value="47 days" icon={TrendingUp} description="Lead-to-close" trend={{ value: "28% improvement", positive: true }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Leads by Agent</h3>
          <div className="h-64">
            <BarChart
              data={agentsLeaderboard.map((a) => ({ label: a.name.split(" ")[0], value: a.leads }))}
              color="var(--color-brand)"
            />
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Top Performers</h3>
          <div className="space-y-3">
            {agentsLeaderboard.map((agent, i) => (
              <div key={agent.name} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted">{agent.closed} closed / {agent.leads} leads</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-success">{agent.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeads({ limit: 100 });
  const { data: propsData, isLoading: propsLoading, isError: propsError, refetch: refetchProps } = useProperties({ limit: 100 });
  const leads = leadsData?.data || [];
  const properties = propsData?.data || [];

  if (leadsLoading || propsLoading) {
    return <DashboardLoading />;
  }

  if (leadsError || propsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => { refetchLeads(); refetchProps(); }} />;
  }

  const statusCounts: Record<string, number> = {};
  leads.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="5" icon={Users} description="Across all agencies" />
        <StatCard title="Properties" value={properties.length} icon={Building2} />
        <StatCard title="AI Generations" value="135" icon={Sparkles} description="This week" />
        <StatCard title="Active Agencies" value="1" icon={Shield} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Platform Activity</h3>
          <div className="h-64">
            <LineChart
              data={[
                { label: "Mon", value: 12 },
                { label: "Tue", value: 18 },
                { label: "Wed", value: 15 },
                { label: "Thu", value: 22 },
                { label: "Fri", value: 19 },
              ]}
            />
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Lead Distribution</h3>
          <div className="h-64">
            <PieChart
              data={[
                { name: "New", value: statusCounts["new"] || 8 },
                { name: "Contacted", value: statusCounts["contacted"] || 5 },
                { name: "Qualified", value: statusCounts["qualified"] || 3 },
                { name: "Won", value: statusCounts["won"] || 2 },
                { name: "Lost", value: statusCounts["lost"] || 4 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
