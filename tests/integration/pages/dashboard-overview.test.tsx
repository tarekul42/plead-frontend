import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockGet = vi.hoisted(() => vi.fn());
vi.mock("@/lib/api-client", () => ({
  default: {
    get: mockGet,
    interceptors: { request: { use: vi.fn().mockReturnValue(0) }, response: { use: vi.fn().mockReturnValue(0) } },
  },
  setAuthToken: vi.fn(),
  usersApi: {
    me: () => mockGet("/users/me").then((r: { data: unknown }) => r.data),
  },
  leadsApi: {
    list: (params?: unknown) => mockGet("/leads", { params }).then((r: { data: unknown }) => r.data),
  },
  propertiesApi: {
    list: (params?: unknown) => mockGet("/properties", { params }).then((r: { data: unknown }) => r.data),
  },
}));

import DashboardPage from "@/app/dashboard/page";

beforeEach(() => {
  vi.mocked(mockGet).mockImplementation((url: string) => {
    if (url === "/users/me") {
      return Promise.resolve({ data: { success: true, data: { _id: "agent-1", role: "agent", agencyId: "agency-1" } } });
    }
    if (url === "/leads") {
      return Promise.resolve({
        data: {
          success: true,
          data: [
            { _id: "lead-1", name: "John Doe", status: "new", budget: 500000, createdAt: "2025-01-15T00:00:00Z" },
          ],
          meta: { total: 1, page: 1, limit: 5 },
        },
      });
    }
    if (url === "/leads/stats") {
      return Promise.resolve({ data: { success: true, data: { totalLeads: 10, newLeads: 5 } } });
    }
    if (url === "/properties") {
      return Promise.resolve({
        data: {
          success: true,
          data: [],
          meta: { total: 0, page: 1, limit: 100 },
        },
      });
    }
    return Promise.resolve({ data: { success: true, data: [] } });
  });
});

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
