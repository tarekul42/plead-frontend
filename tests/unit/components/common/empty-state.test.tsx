import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/common/empty-state";

describe("EmptyState", () => {
  it("renders default title and message", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters or check back later."),
    ).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(<EmptyState title="No leads" message="No leads match your criteria" />);
    expect(screen.getByText("No leads")).toBeInTheDocument();
    expect(screen.getByText("No leads match your criteria")).toBeInTheDocument();
  });

  it("renders action element", () => {
    render(<EmptyState action={<button>Create</button>} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
