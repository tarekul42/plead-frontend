import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockGet = vi.fn().mockResolvedValue({
  data: {
    data: {
      totalLeads: 42,
      totalProperties: 15,
      totalInteractions: 128,
      conversionRate: 0.23,
    },
  },
});

vi.mock("@/lib/api-client", () => ({
  default: {
    get: mockGet,
    interceptors: { response: { use: vi.fn() } },
  },
  setAuthToken: vi.fn(),
}));

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardLoading } from "@/components/common/dashboard-loading";
import { ErrorState } from "@/components/common/error-state";
import { Users, Home, MessageSquare, TrendingUp } from "lucide-react";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock Dashboard Stats Page
function DashboardStatsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [stats, setStats] = React.useState<{
    totalLeads: number;
    totalProperties: number;
    totalInteractions: number;
    conversionRate: number;
  } | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const { default: client } = await import("@/lib/api-client");
      const response = await client.get("/dashboard/stats");
      setStats(response.data.data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) return <DashboardLoading />;
  if (hasError) return <ErrorState message="Failed to load dashboard stats." onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <div data-testid="dashboard-stats">
      <h1>Agent Overview</h1>
      <div data-testid="stat-cards">
        <StatCard title="My Leads" value={stats.totalLeads} icon={Users} />
        <StatCard title="Properties" value={stats.totalProperties} icon={Home} />
        <StatCard title="Interactions" value={stats.totalInteractions} icon={MessageSquare} />
        <StatCard title="Conversion" value={`${stats.conversionRate * 100}%`} icon={TrendingUp} />
      </div>
      <button onClick={fetchStats} data-testid="refresh-btn">Refresh</button>
    </div>
  );
}

import React from "react";

describe("Dashboard Stats: Loading, Error States, Refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue({
      data: {
        data: {
          totalLeads: 42,
          totalProperties: 15,
          totalInteractions: 128,
          conversionRate: 0.23,
        },
      },
    });
  });

  it("renders loading skeleton while fetching stats", () => {
    renderWithProviders(<DashboardStatsPage />);

    // DashboardLoading renders skeleton placeholders
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders stat cards after successful data load", async () => {
    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });

    expect(screen.getByText("My Leads")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Interactions")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Conversion")).toBeInTheDocument();
    expect(screen.getByText("23%")).toBeInTheDocument();
  });

  it("renders individual StatCard with correct props", async () => {
    renderWithProviders(
      <div>
        <StatCard title="Test Stat" value={100} icon={Users} description="Test description" />
      </div>
    );

    expect(screen.getByText("Test Stat")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders StatCard with trend indicator", () => {
    renderWithProviders(
      <div>
        <StatCard
          title="Trending"
          value={50}
          icon={TrendingUp}
          trend={{ value: "+12% from last month", positive: true }}
        />
      </div>
    );

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("+12% from last month")).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Server error"));

    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard stats.")).toBeInTheDocument();
    });

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("retry button re-fetches data", async () => {
    mockGet.mockRejectedValueOnce(new Error("Server error"));

    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Try again")).toBeInTheDocument();
    });

    // Restore mock for retry
    mockGet.mockResolvedValueOnce({
      data: {
        data: {
          totalLeads: 42,
          totalProperties: 15,
          totalInteractions: 128,
          conversionRate: 0.23,
        },
      },
    });

    act(() => {
      screen.getByText("Try again").click();
    });

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });
  });

  it("refresh button triggers new API call", async () => {
    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledTimes(1);

    act(() => {
      screen.getByTestId("refresh-btn").click();
    });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });

  it("handles zero values correctly", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: {
          totalLeads: 0,
          totalProperties: 0,
          totalInteractions: 0,
          conversionRate: 0,
        },
      },
    });

    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });

    // Should display 0 values
    const statValues = screen.getAllByText("0");
    expect(statValues.length).toBeGreaterThan(0);
  });

  it("handles large numbers correctly", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: {
          totalLeads: 10000,
          totalProperties: 500,
          totalInteractions: 25000,
          conversionRate: 0.85,
        },
      },
    });

    renderWithProviders(<DashboardStatsPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });

    expect(screen.getByText("10000")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});
