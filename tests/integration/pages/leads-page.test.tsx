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

import LeadsPage from "@/app/dashboard/leads/page";

function renderWithProviders() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <LeadsPage />
    </QueryClientProvider>,
  );
}

describe("LeadsPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders leads page heading", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Leads")).toBeInTheDocument();
    });
  });

  it("renders view toggle buttons", () => {
    renderWithProviders();
    expect(screen.getByText("Table")).toBeInTheDocument();
  });

  it("renders lead count from API", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/total/)).toBeInTheDocument();
    });
  });
});
