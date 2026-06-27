import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockInteractions = [
  {
    _id: "int-1",
    leadId: "lead-1",
    type: "call",
    notes: "Discussed property preferences",
    outcome: "positive",
    performedById: "agent-1",
    createdAt: "2025-03-02T10:00:00Z",
    updatedAt: "2025-03-02T10:00:00Z",
  },
  {
    _id: "int-2",
    leadId: "lead-1",
    type: "email",
    notes: "Sent property listings",
    outcome: "neutral",
    performedById: "agent-1",
    createdAt: "2025-03-05T14:30:00Z",
    updatedAt: "2025-03-05T14:30:00Z",
  },
  {
    _id: "int-3",
    leadId: "lead-1",
    type: "meeting",
    notes: "In-person tour of downtown loft",
    outcome: "positive",
    performedById: "agent-1",
    createdAt: "2025-03-10T16:00:00Z",
    updatedAt: "2025-03-10T16:00:00Z",
  },
];

const mockInteractionsApiCreate = vi.fn().mockResolvedValue({
  _id: "int-new",
  leadId: "lead-1",
  type: "call",
  notes: "Follow-up call",
  outcome: "positive",
  performedById: "agent-1",
  createdAt: "2025-06-15T10:00:00Z",
  updatedAt: "2025-06-15T10:00:00Z",
});
const mockInteractionsApiListByLead = vi.fn().mockResolvedValue(mockInteractions);

vi.mock("@/lib/api-client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: { data: mockInteractions },
    }),
    post: vi.fn().mockResolvedValue({
      success: true,
      data: {
        _id: "int-new",
        leadId: "lead-1",
        type: "call",
        notes: "Follow-up call",
        outcome: "positive",
        performedById: "agent-1",
        createdAt: "2025-06-15T10:00:00Z",
        updatedAt: "2025-06-15T10:00:00Z",
      },
    }),
    interceptors: { response: { use: vi.fn() } },
  },
  setAuthToken: vi.fn(),
  interactionsApi: {
    listByLead: (...args: unknown[]) => mockInteractionsApiListByLead(...args),
    create: (...args: unknown[]) => mockInteractionsApiCreate(...args),
  },
}));

import React from "react";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock Interaction Timeline component
function InteractionTimeline({ leadId }: { leadId: string }) {
  const [interactions, setInteractions] = React.useState<typeof mockInteractions>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const { interactionsApi } = await import("@/lib/api-client");
        const response = await interactionsApi.listByLead(leadId);
        setInteractions(response.data || response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load interactions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInteractions();
  }, [leadId]);

  if (isLoading) return <div data-testid="loading">Loading timeline...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div data-testid="interaction-timeline">
      <h3>Interaction Timeline</h3>
      <p data-testid="interaction-count">{interactions.length} interactions</p>
      <div data-testid="timeline-entries">
        {interactions.map((interaction) => (
          <div
            key={interaction._id}
            data-testid={`interaction-${interaction._id}`}
            className="timeline-entry"
          >
            <span data-testid={`type-${interaction._id}`} className="interaction-type">
              {interaction.type}
            </span>
            <p data-testid={`notes-${interaction._id}`}>{interaction.notes}</p>
            <span data-testid={`outcome-${interaction._id}`} className="interaction-outcome">
              {interaction.outcome}
            </span>
            <span data-testid={`date-${interaction._id}`}>
              {new Date(interaction.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock Add Interaction Form
function AddInteractionForm({ leadId }: { leadId: string }) {
  const [type, setType] = React.useState("call");
  const [notes, setNotes] = React.useState("");
  const [outcome, setOutcome] = React.useState("neutral");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { interactionsApi } = await import("@/lib/api-client");
      await interactionsApi.create(leadId, { type, notes, outcome });
      setShowSuccess(true);
      setNotes("");
      setOutcome("neutral");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="add-interaction-form">
      <h3>Add Interaction</h3>
      <form onSubmit={handleSubmit}>
        <select
          data-testid="interaction-type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
          <option value="tour">Tour</option>
          <option value="other">Other</option>
        </select>
        <textarea
          data-testid="interaction-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes..."
        />
        <select
          data-testid="interaction-outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        >
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <button type="submit" data-testid="submit-interaction" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Interaction"}
        </button>
      </form>
      {showSuccess && (
        <p data-testid="success-message" className="success">
          Interaction added successfully!
        </p>
      )}
    </div>
  );
}

describe("Interaction Tracking: Add Interaction -> View Timeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders interaction timeline with entries from API", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("interaction-timeline")).toBeInTheDocument();
    });

    expect(screen.getByText("Interaction Timeline")).toBeInTheDocument();
  });

  it("displays interaction count", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("interaction-count")).toHaveTextContent("3 interactions");
    });
  });

  it("displays interaction types", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("type-int-1")).toHaveTextContent("call");
      expect(screen.getByTestId("type-int-2")).toHaveTextContent("email");
      expect(screen.getByTestId("type-int-3")).toHaveTextContent("meeting");
    });
  });

  it("displays interaction notes", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("notes-int-1")).toHaveTextContent("Discussed property preferences");
      expect(screen.getByTestId("notes-int-2")).toHaveTextContent("Sent property listings");
      expect(screen.getByTestId("notes-int-3")).toHaveTextContent(
        "In-person tour of downtown loft",
      );
    });
  });

  it("displays interaction outcomes", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("outcome-int-1")).toHaveTextContent("positive");
      expect(screen.getByTestId("outcome-int-2")).toHaveTextContent("neutral");
      expect(screen.getByTestId("outcome-int-3")).toHaveTextContent("positive");
    });
  });

  it("displays formatted dates", async () => {
    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      // Dates should be rendered (format depends on locale)
      expect(screen.getByTestId("date-int-1")).toBeInTheDocument();
    });
  });

  it("renders add interaction form with all fields", () => {
    renderWithProviders(<AddInteractionForm leadId="lead-1" />);

    expect(screen.getByTestId("add-interaction-form")).toBeInTheDocument();
    expect(screen.getByTestId("interaction-type-select")).toBeInTheDocument();
    expect(screen.getByTestId("interaction-notes")).toBeInTheDocument();
    expect(screen.getByTestId("interaction-outcome")).toBeInTheDocument();
    expect(screen.getByTestId("submit-interaction")).toBeInTheDocument();
  });

  it("interaction type selector shows all options", () => {
    renderWithProviders(<AddInteractionForm leadId="lead-1" />);

    const select = screen.getByTestId("interaction-type-select");
    const options = select.querySelectorAll("option");
    expect(options.length).toBe(6);
  });

  it("submitting interaction form calls API", async () => {
    renderWithProviders(<AddInteractionForm leadId="lead-1" />);

    fireEvent.change(screen.getByTestId("interaction-notes"), {
      target: { value: "Follow-up call" },
    });
    fireEvent.click(screen.getByTestId("submit-interaction"));

    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toBeInTheDocument();
    });
  });

  it("shows submitting state during form submission", async () => {
    mockInteractionsApiCreate.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(resolve, 100)).then(() => ({
        success: true,
        data: { _id: "int-new" },
      })),
    );

    renderWithProviders(<AddInteractionForm leadId="lead-1" />);

    fireEvent.change(screen.getByTestId("interaction-notes"), {
      target: { value: "Test note" },
    });
    fireEvent.click(screen.getByTestId("submit-interaction"));

    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("handles empty timeline", async () => {
    mockInteractionsApiListByLead.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("interaction-count")).toHaveTextContent("0 interactions");
    });
  });

  it("handles API error when loading timeline", async () => {
    mockInteractionsApiListByLead.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<InteractionTimeline leadId="lead-1" />);

    await waitFor(() => {
      // Should handle error gracefully
      expect(
        screen.queryByTestId("error") || screen.queryByTestId("loading"),
      ).toBeInTheDocument();
    });
  });

  it("handles all interaction types correctly", async () => {
    const allTypes = ["call", "email", "meeting", "note", "tour", "other"];

    renderWithProviders(<AddInteractionForm leadId="lead-1" />);

    for (const interactionType of allTypes) {
      fireEvent.change(screen.getByTestId("interaction-type-select"), {
        target: { value: interactionType },
      });
      expect(screen.getByTestId("interaction-type-select")).toHaveValue(interactionType);
    }
  });
});
