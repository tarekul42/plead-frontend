"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart, PieChart, BarChart } from "@/components/charts/chart-wrapper";
import { DashboardLoading } from "@/components/common/dashboard-loading";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { useLeads } from "@/lib/queries/use-leads";
import { useProperties } from "@/lib/queries/use-properties";
import { useInteractions } from "@/lib/queries/use-interactions";
import { useUsers } from "@/lib/queries/use-users";
import {
  Building2,
  Users,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Shield,
  DollarSign,
  Star,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { formatCompactPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayInteractions(interactions: any[]) {
  const counts: Record<string, number> = {};
  for (let i = 0; i < 7; i++) counts[DAY_NAMES[i]] = 0;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  interactions.forEach((ix) => {
    const d = new Date(ix.createdAt);
    if (d >= weekStart) {
      const name = DAY_NAMES[d.getDay()];
      counts[name] = (counts[name] || 0) + 1;
    }
  });
  return DAY_NAMES.map((name) => ({ label: name, value: counts[name] }));
}

function avgLeadValue(leads: any[]) {
  const withBudget = leads.filter((l: any) => l.budget && l.budget > 0);
  if (withBudget.length === 0) return 0;
  return withBudget.reduce((s: number, l: any) => s + l.budget, 0) / withBudget.length;
}

export default function DashboardPage() {
  const { role, isLoading, isError, error, user } = useCurrentUser();

  if (isLoading) return <DashboardLoading />;
  if (isError) return <ErrorState message={error?.message || "Could not load user data."} />;
  if (!user) return <DashboardLoading />;
  if (role === "admin") return <AdminOverview />;
  if (role === "manager") return <ManagerOverview />;
  return <AgentOverview />;
}

function AgentOverview() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeads({ limit: 100 });
  const { data: interactionsData, isLoading: intLoading, isError: intError } = useInteractions();
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["lead-stats"],
    queryFn: () => apiClient.get("/leads/stats").then((r) => r.data.data),
  });

  const leads = leadsData?.data || [];
  const interactions = interactionsData?.data || [];
  const statusCounts: Record<string, number> = {};
  leads.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });
  const wonLeads = leads.filter((l: any) => l.status === "closed");
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(0) : "0";
  const weeklyTrend = (statsData as any)?.weeklyTrend?.map((w: any) => ({ label: w.date ? w.date.slice(5) : w._id || "", value: w.count })) || [];
  const dayIntData = getDayInteractions(interactions);
  const avgValue = avgLeadValue(leads);

  if (leadsLoading || statsLoading || intLoading) {
    return <DashboardLoading />;
  }

  if (leadsError || intError || statsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => refetchLeads()} />;
  }

  return (
    <div>
      <PageHeader
        title="Agent Overview"
        description="Track your leads, interactions, and performance at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          color="brand"
          trend={{ value: `${wonLeads.length} won this period`, positive: wonLeads.length > 0 }}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          color="success"
          trend={{ value: "Lead-to-close ratio", positive: Number(conversionRate) > 20 }}
        />
        <StatCard
          title="Interactions"
          value={interactions.length}
          icon={MessageSquare}
          color="warning"
        />
        <StatCard
          title="Avg Lead Value"
          value={avgValue ? formatCompactPrice(avgValue) : "$0"}
          icon={DollarSign}
          color="brand"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Leads Over Time (7 days)</h3>
          <div className="h-64">
            <LineChart data={weeklyTrend.length > 0 ? weeklyTrend : [{ label: "No data", value: 0 }]} />
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Lead Status</h3>
          <div className="h-64">
            <PieChart
              data={[
                { name: "New", value: statusCounts["new"] || 0 },
                { name: "Contacted", value: statusCounts["contacted"] || 0 },
                { name: "Qualified", value: statusCounts["qualified"] || 0 },
                { name: "Negotiating", value: statusCounts["negotiating"] || 0 },
                { name: "Closed", value: statusCounts["closed"] || 0 },
                { name: "Lost", value: statusCounts["lost"] || 0 },
              ]}
            />
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Interactions This Week</h3>
          <div className="h-64">
            <BarChart data={dayIntData} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent Leads</h3>
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        {leads.length > 0 ? (
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
                {leads.slice(0, 5).map((lead: any) => (
                  <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-neutral-50 dark:hover:bg-surface/50">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted">
                      {lead.budget ? formatCompactPrice(lead.budget) : "-"}
                    </td>
                    <td className="p-4 text-muted">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}
                    </td>
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
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError } = useLeads({ limit: 100 });
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProperties({ limit: 100 });
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["lead-stats-manager"],
    queryFn: () => apiClient.get("/leads/stats").then((r) => r.data.data),
  });

  const isLoading = leadsLoading || propsLoading || usersLoading || statsLoading;
  const managerError = leadsError || propsError || usersError || statsError;

  const leads = leadsData?.data || [];
  const properties = propsData?.data || [];
  const users = usersData?.data || [];
  const agents = users.filter((u: any) => u.role === "agent");
  const stats = statsData as any;

  const agentLeadCounts: Record<string, { name: string; leads: number; closed: number }> = {};
  users.forEach((u: any) => {
    if (u.role === "agent" || u.role === "manager") {
      agentLeadCounts[u._id] = { name: u.name, leads: 0, closed: 0 };
    }
  });
  leads.forEach((l: any) => {
    const agentId = l.assignedAgentId;
    if (agentId && agentLeadCounts[agentId]) {
      agentLeadCounts[agentId].leads++;
      if (l.status === "closed") agentLeadCounts[agentId].closed++;
    }
  });
  const sortedAgents = Object.values(agentLeadCounts).sort((a, b) => b.leads - a.leads);
  const chartData = sortedAgents.map((a) => ({ label: a.name.split(" ")[0], value: a.leads }));

  if (isLoading) return <DashboardLoading />;
  if (managerError) return <ErrorState message="Failed to load dashboard data." />;

  return (
    <div>
      <PageHeader
        title="Manager Overview"
        description="Monitor agency performance and team activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Agency Leads" value={leads.length} icon={Users} description="All active leads" />
        <StatCard title="Properties" value={properties.length} icon={Building2} />
        <StatCard title="Team Agents" value={agents.length} icon={Shield} />
        <StatCard
          title="Conversion Rate"
          value={stats?.conversionRate ? `${stats.conversionRate}%` : "0%"}
          icon={TrendingUp}
          description="Lead-to-close"
          trend={{ value: `${stats?.total || 0} total leads`, positive: (stats?.conversionRate || 0) > 20 }}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Leads by Agent</h3>
          <div className="h-64">
            {chartData.length > 0 ? <BarChart data={chartData} /> : (
              <div className="flex h-full items-center justify-center text-sm text-muted">No agent data</div>
            )}
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Top Performers</h3>
          <div className="space-y-3">
            {sortedAgents.length > 0 ? sortedAgents.map((agent, i) => {
              const rate = agent.leads > 0 ? Math.round((agent.closed / agent.leads) * 100) : 0;
              return (
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
                  <span className="text-sm font-semibold text-success">{rate}%</span>
                </div>
              );
            }) : (
              <div className="flex h-32 items-center justify-center text-sm text-muted">No team data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError } = useLeads({ limit: 100 });
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProperties({ limit: 100 });
  const { data: adminStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient.get("/admin/stats").then((r) => r.data.data),
  });

  const isLoading = leadsLoading || propsLoading || statsLoading;
  const adminError = leadsError || propsError || statsError;

  const leads = leadsData?.data || [];
  const properties = propsData?.data || [];
  const stats = (adminStats || {}) as any;

  const statusCounts: Record<string, number> = {};
  leads.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  if (isLoading) return <DashboardLoading />;
  if (adminError) return <ErrorState message="Failed to load admin dashboard data." />;

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description="Platform-wide metrics and system health."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} description={stats?.totalUsers ? "Active users" : "Loading..."} />
        <StatCard title="Properties" value={properties.length} icon={Building2} />
        <StatCard title="AI Generations" value={stats?.aiCalls ?? 0} icon={Sparkles} description={stats?.aiCalls ? "All time" : "No AI calls yet"} />
        <StatCard title="Active Leads" value={stats?.activeLeads ?? leads.length} icon={Star} color="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-sm text-muted">Total Leads</span>
              <span className="text-lg font-bold">{stats?.totalLeads ?? leads.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-sm text-muted">Active Leads</span>
              <span className="text-lg font-bold">{stats?.activeLeads ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-sm text-muted">Total Reviews</span>
              <span className="text-lg font-bold">{stats?.totalReviews ?? 0}</span>
            </div>
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">Lead Distribution</h3>
          <div className="h-64">
            <PieChart
              data={[
                { name: "New", value: statusCounts["new"] || 0 },
                { name: "Contacted", value: statusCounts["contacted"] || 0 },
                { name: "Qualified", value: statusCounts["qualified"] || 0 },
                { name: "Negotiating", value: statusCounts["negotiating"] || 0 },
                { name: "Closed", value: statusCounts["closed"] || 0 },
                { name: "Lost", value: statusCounts["lost"] || 0 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
