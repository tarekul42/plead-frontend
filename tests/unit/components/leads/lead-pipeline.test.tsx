import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { LeadPipeline } from "@/components/leads/lead-pipeline";
import type { Lead } from "@/types";

// jsdom doesn't provide DataTransfer; mock it for drag-and-drop tests
class MockDataTransfer {
  data = new Map<string, string>();
  setData(type: string, value: string) { this.data.set(type, value); }
  getData(type: string) { return this.data.get(type) || ""; }
  clearData() { this.data.clear(); }
  setDragImage() {}
}
beforeAll(() => {
  vi.stubGlobal("DataTransfer", MockDataTransfer);
});

// Mock useLeads hook
const mockUseLeads = vi.fn();
vi.mock("@/lib/queries/use-leads", () => ({
  useLeads: () => mockUseLeads(),
}));

const mockLeads: Lead[] = [
  {
    _id: "lead-1",
    name: "John Doe",
    email: "john@example.com",
    budget: 500000,
    status: "new",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    _id: "lead-2",
    name: "Jane Smith",
    email: "jane@example.com",
    budget: 750000,
    status: "contacted",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-02T00:00:00Z",
    updatedAt: "2025-03-02T00:00:00Z",
  },
  {
    _id: "lead-3",
    name: "Bob Wilson",
    email: "bob@example.com",
    budget: 300000,
    status: "qualified",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-03T00:00:00Z",
    updatedAt: "2025-03-03T00:00:00Z",
  },
  {
    _id: "lead-4",
    name: "Alice Brown",
    email: "alice@example.com",
    budget: 600000,
    status: "won",
    assignedAgentId: "agent-1",
    createdAt: "2025-03-04T00:00:00Z",
    updatedAt: "2025-03-04T00:00:00Z",
  },
];

describe("LeadPipeline (Kanban)", () => {
  it("renders all pipeline columns", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline />);

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Contacted")).toBeInTheDocument();
    expect(screen.getByText("Qualified")).toBeInTheDocument();
    expect(screen.getByText("Won")).toBeInTheDocument();
  });

  it("renders leads in correct columns based on status", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline />);

    // John Doe should be in "New"
    const newColumn = screen.getByText("New").closest("[data-column], [data-status]") || screen.getByText("New").parentElement?.parentElement;
    expect(newColumn).toHaveTextContent("John Doe");
  });

  it("shows loading state", () => {
    mockUseLeads.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<LeadPipeline />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when no leads", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: [] },
      isLoading: false,
    });

    render(<LeadPipeline />);
    expect(screen.getByText(/no leads|empty|no data/i)).toBeInTheDocument();
  });

  it("calls onLeadClick when a lead card is clicked", () => {
    const onLeadClick = vi.fn();
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline onLeadClick={onLeadClick} />);
    fireEvent.click(screen.getByText("John Doe"));

    expect(onLeadClick).toHaveBeenCalledWith(mockLeads[0]);
  });

  it("supports drag and drop to change lead status", () => {
    const onStatusChange = vi.fn();
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline onStatusChange={onStatusChange} />);

    const leadCard = screen.getByText("John Doe");
    const dt = new DataTransfer();
    fireEvent.dragStart(leadCard, { dataTransfer: dt });

    const contactedColumn = screen.getByText("Contacted");
    fireEvent.drop(contactedColumn, { dataTransfer: dt });

    expect(onStatusChange).toHaveBeenCalledWith("lead-1", "contacted");
  });

  it("displays lead count per column", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline />);

    // Each column should show a count badge
    const countBadges = screen.getAllByText(/\d/);
    expect(countBadges.length).toBeGreaterThan(0);
  });

  it("shows error state on fetch failure", () => {
    mockUseLeads.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<LeadPipeline />);
    expect(screen.getByText(/error|failed to load/i)).toBeInTheDocument();
  });

  it("renders column colors", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    const { container } = render(<LeadPipeline />);

    // Check that columns have distinguishing styles
    const columns = container.querySelectorAll('[class*="column"], [class*="col"]');
    expect(columns.length).toBeGreaterThan(0);
  });

  it("has a filter or search input", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline />);
    const searchInput = screen.getByPlaceholderText(/search|filter/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("filters leads by search query", () => {
    mockUseLeads.mockReturnValue({
      data: { success: true, data: mockLeads },
      isLoading: false,
    });

    render(<LeadPipeline />);

    const searchInput = screen.getByPlaceholderText(/search|filter/i);
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });
});
