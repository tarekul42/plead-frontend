import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LeadCard } from "@/components/leads/lead-card";
import type { Lead } from "@/types/models";

const mockLead: Lead = {
  _id: "lead-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1-555-0101",
  budget: 500000,
  preferredLocation: "Austin, TX",
  status: "new",
  source: "website",
  assignedAgentId: "agent-1",
  createdAt: "2025-03-01T00:00:00Z",
  updatedAt: "2025-03-01T00:00:00Z",
};

describe("LeadCard", () => {
  it("renders the lead name", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders the lead email", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders the lead phone when provided", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("+1-555-0101")).toBeInTheDocument();
  });

  it("renders formatted budget", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("$500,000")).toBeInTheDocument();
  });

  it("renders the preferred location", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("renders source when provided", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText("website")).toBeInTheDocument();
  });

  it("calls onView when view button is clicked", () => {
    const onView = vi.fn();
    render(<LeadCard lead={mockLead} onView={onView} />);

    fireEvent.click(screen.getByRole("button", { name: /view|details/i }));
    expect(onView).toHaveBeenCalledWith(mockLead);
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(<LeadCard lead={mockLead} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockLead);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(<LeadCard lead={mockLead} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /delete|remove/i }));
    expect(onDelete).toHaveBeenCalledWith(mockLead);
  });

  it("renders without optional fields", () => {
    const minimalLead: Lead = {
      _id: "lead-2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "contacted",
      assignedAgentId: "agent-1",
      createdAt: "2025-03-01T00:00:00Z",
      updatedAt: "2025-03-01T00:00:00Z",
    };

    render(<LeadCard lead={minimalLead} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("shows created date", () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText(/Mar 1, 2025|3\/1\/2025/)).toBeInTheDocument();
  });

  it("applies different styling based on status", () => {
    const { container: newContainer } = render(
      <LeadCard lead={{ ...mockLead, status: "new" }} />,
    );
    expect(newContainer.querySelector('[class*="new"]')).toBeInTheDocument();

    const { container: contactedContainer } = render(
      <LeadCard lead={{ ...mockLead, status: "contacted" }} />,
    );
    expect(contactedContainer.querySelector('[class*="contacted"]')).toBeInTheDocument();
  });

  it("is accessible as a card region", () => {
    render(<LeadCard lead={mockLead} />);
    const card = screen.getByRole("article") || screen.getByRole("region", { name: /john doe/i });
    expect(card).toBeInTheDocument();
  });
});
