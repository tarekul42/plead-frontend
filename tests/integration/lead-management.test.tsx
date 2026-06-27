import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockLeadsApiList = vi.fn().mockResolvedValue({
  success: true,
  data: [
    {
      _id: "lead-1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0101",
      budget: 500000,
      preferredLocation: "Austin, TX",
      status: "new",
      assignedAgentId: "agent-1",
      createdAt: "2025-03-01T00:00:00Z",
      updatedAt: "2025-03-01T00:00:00Z",
    },
  ],
  meta: { page: 1, limit: 20, total: 1 },
});
const mockLeadsApiCreate = vi.fn().mockResolvedValue({
  success: true,
  data: {
    _id: "lead-new",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1-555-0202",
    budget: 600000,
    status: "new",
    assignedAgentId: "agent-1",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
});
const mockLeadsApiUpdate = vi.fn().mockResolvedValue({
  success: true,
  data: {
    _id: "lead-1",
    name: "John Doe",
    email: "john@example.com",
    status: "qualified",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
  },
});

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
    post: vi.fn().mockResolvedValue({
      success: true,
      data: {
        _id: "lead-new",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1-555-0202",
        budget: 600000,
        preferredLocation: "Austin, TX",
        status: "new",
        assignedAgentId: "agent-1",
        createdAt: "2025-06-01T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    }),
    patch: vi.fn().mockResolvedValue({
      success: true,
      data: {
        _id: "lead-1",
        name: "John Doe",
        email: "john@example.com",
        status: "qualified",
        assignedAgentId: "agent-1",
        createdAt: "2025-03-01T00:00:00Z",
        updatedAt: "2025-06-15T00:00:00Z",
      },
    }),
    interceptors: { response: { use: vi.fn() } },
  },
  setAuthToken: vi.fn(),
  leadsApi: {
    list: (...args: unknown[]) => mockLeadsApiList(...args),
    get: vi.fn().mockResolvedValue({
      success: true,
      data: {
        _id: "lead-1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-0101",
        budget: 500000,
        status: "new",
        assignedAgentId: "agent-1",
        createdAt: "2025-03-01T00:00:00Z",
        updatedAt: "2025-03-01T00:00:00Z",
      },
    }),
    create: (...args: unknown[]) => mockLeadsApiCreate(...args),
    update: (...args: unknown[]) => mockLeadsApiUpdate(...args),
  },
}));

import { useLeads, useCreateLead, useUpdateLead } from "@/lib/queries/use-leads";
import { EmptyState } from "@/components/common/empty-state";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock Lead List component
function LeadListPage() {
  const { data, isLoading, isError } = useLeads();

  if (isLoading) return <div data-testid="loading">Loading leads...</div>;
  if (isError) return <div data-testid="error">Error loading leads</div>;

  const leads = data?.data ?? [];

  return (
    <div>
      <h1>Leads</h1>
      <p data-testid="lead-count">Total: {data?.meta?.total ?? 0}</p>
      <div data-testid="lead-list">
        {leads.map((lead) => (
          <div key={lead._id} data-testid={`lead-${lead._id}`}>
            <span>{lead.name}</span>
            <span>{lead.email}</span>
            <span data-testid={`status-${lead._id}`}>{lead.status}</span>
          </div>
        ))}
      </div>
      {leads.length === 0 && (
        <EmptyState title="No leads yet" message="Create your first lead to get started." />
      )}
    </div>
  );
}

// Mock Create Lead form
function CreateLeadForm({ onSuccess }: { onSuccess?: () => void }) {
  const createLead = useCreateLead();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead.mutateAsync({ name, email });
      onSuccess?.();
    } catch {
      // handle error gracefully
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="create-lead-form">
      <input
        data-testid="lead-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        data-testid="lead-email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit" data-testid="submit-lead">
        Create Lead
      </button>
    </form>
  );
}

// Mock Update Lead Status component
function LeadStatusUpdater({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const updateLead = useUpdateLead(leadId);
  const [status, setStatus] = React.useState(currentStatus);

  const handleUpdate = async () => {
    await updateLead.mutateAsync({ status });
  };

  return (
    <div data-testid="lead-status-updater">
      <select
        data-testid="status-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="negotiating">Negotiating</option>
        <option value="closed">Closed</option>
        <option value="lost">Lost</option>
      </select>
      <button onClick={handleUpdate} data-testid="update-status-btn">
        Update Status
      </button>
    </div>
  );
}

import React from "react";

describe("Lead Management: Create -> View -> Update Status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders lead list with data from API", async () => {
    renderWithProviders(<LeadListPage />);

    await waitFor(() => {
      expect(screen.getByText("Leads")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("displays lead count from API response", async () => {
    renderWithProviders(<LeadListPage />);

    await waitFor(() => {
      expect(screen.getByText(/Total: 1/)).toBeInTheDocument();
    });
  });

  it("displays lead status badge", async () => {
    renderWithProviders(<LeadListPage />);

    await waitFor(() => {
      expect(screen.getByTestId("status-lead-1")).toHaveTextContent("new");
    });
  });

  it("shows empty state when no leads exist", async () => {
    mockLeadsApiList.mockResolvedValueOnce({
      success: true,
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    });

    renderWithProviders(<LeadListPage />);

    await waitFor(() => {
      expect(screen.getByText("No leads yet")).toBeInTheDocument();
    });
  });

  it("renders create lead form", () => {
    renderWithProviders(<CreateLeadForm />);

    expect(screen.getByTestId("create-lead-form")).toBeInTheDocument();
    expect(screen.getByTestId("lead-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("lead-email-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-lead")).toBeInTheDocument();
  });

  it("create lead form calls API on submit", async () => {
    const onSuccess = vi.fn();

    renderWithProviders(<CreateLeadForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByTestId("lead-name-input"), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByTestId("lead-email-input"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-lead"));

    await waitFor(() => {
      expect(mockLeadsApiCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Jane Smith", email: "jane@example.com" }),
      );
    });
  });

  it("renders status updater with current status selected", () => {
    renderWithProviders(<LeadStatusUpdater leadId="lead-1" currentStatus="new" />);

    const select = screen.getByTestId("status-select");
    expect(select).toHaveValue("new");
  });

  it("updating lead status calls API with new status", async () => {
    renderWithProviders(<LeadStatusUpdater leadId="lead-1" currentStatus="new" />);

    fireEvent.change(screen.getByTestId("status-select"), {
      target: { value: "qualified" },
    });
    fireEvent.click(screen.getByTestId("update-status-btn"));

    await waitFor(() => {
      expect(mockLeadsApiUpdate).toHaveBeenCalledWith(
        "lead-1",
        expect.objectContaining({ status: "qualified" }),
      );
    });
  });

  it("handles API error when loading leads", async () => {
    mockLeadsApiList.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<LeadListPage />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });

  it("handles API error when creating lead", async () => {
    mockLeadsApiCreate.mockRejectedValueOnce(new Error("Validation error"));

    renderWithProviders(<CreateLeadForm />);

    fireEvent.change(screen.getByTestId("lead-name-input"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("submit-lead"));

    await waitFor(() => {
      // The form should handle the error without crashing
      expect(screen.getByTestId("create-lead-form")).toBeInTheDocument();
    });
  });
});
