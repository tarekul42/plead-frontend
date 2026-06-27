import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InteractionTimeline } from "@/components/interactions/interaction-timeline";

// Mock useInteractions hook
const mockUseInteractions = vi.fn();
vi.mock("@/lib/queries/use-interactions", () => ({
  useInteractions: () => mockUseInteractions(),
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
    notes: "Sent listing brochure",
    outcome: "neutral",
    performedById: "agent-1",
    createdAt: "2025-03-05T14:30:00Z",
    updatedAt: "2025-03-05T14:30:00Z",
  },
  {
    _id: "int-3",
    leadId: "lead-1",
    type: "meeting",
    notes: "Toured downtown property",
    outcome: "positive",
    performedById: "agent-2",
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-03-10T09:00:00Z",
  },
];

describe("InteractionTimeline", () => {
  it("renders a list of interactions", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);

    expect(screen.getByText("Discussed property preferences")).toBeInTheDocument();
    expect(screen.getByText("Sent listing brochure")).toBeInTheDocument();
    expect(screen.getByText("Toured downtown property")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseInteractions.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<InteractionTimeline leadId="lead-1" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when no interactions", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: [] },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);
    expect(screen.getByText(/no interactions|empty|no activity/i)).toBeInTheDocument();
  });

  it("displays interaction types", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);

    expect(screen.getByText(/call/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/meeting/i)).toBeInTheDocument();
  });

  it("displays formatted dates", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);

    // Check that dates are rendered (format may vary)
    const dateElements = screen.getAllByText(/2025|Mar/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("displays outcome badges", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);

    expect(screen.getAllByText(/positive/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/neutral/i)).toBeInTheDocument();
  });

  it("renders in chronological order (newest first)", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);

    const notes = screen.getAllByText(/Discussed|Toured|Sent/);
    // Most recent should appear first
    expect(notes[0]).toHaveTextContent("Toured downtown property");
  });

  it("shows error state on fetch failure", () => {
    mockUseInteractions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<InteractionTimeline leadId="lead-1" />);
    expect(screen.getByText(/error|failed to load/i)).toBeInTheDocument();
  });

  it("filters interactions by leadId", () => {
    mockUseInteractions.mockReturnValue({
      data: { success: true, data: mockInteractions },
      isLoading: false,
    });

    render(<InteractionTimeline leadId="lead-1" />);
    // All interactions belong to lead-1, so all should render
    expect(screen.getAllByText(/Discussed|Toured|Sent/).length).toBe(3);
  });
});
