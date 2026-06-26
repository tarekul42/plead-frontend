import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

vi.mock("@/lib/api-client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: {
          totalLeads: 10,
          totalProperties: 5,
          totalInteractions: 25,
          conversionRate: 0.12,
        },
      },
    }),
    interceptors: { response: { use: vi.fn() } },
  },
  setAuthToken: vi.fn(),
}));

import DashboardPage from "@/app/dashboard/page";

function renderWithProviders() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <DashboardPage />
    </QueryClientProvider>,
  );
}

describe("DashboardPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders agent overview with dashboard sections", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    });

    expect(screen.getByText("My Leads")).toBeInTheDocument();
  });

  it("renders stat cards with data", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("My Leads")).toBeInTheDocument();
    });
  });
});
