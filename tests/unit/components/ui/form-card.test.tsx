import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormCard, FormGrid } from "@/components/ui/form-card";

describe("FormCard", () => {
  it("renders title when provided", () => {
    render(<FormCard title="Property Details">content</FormCard>);
    expect(screen.getByText("Property Details")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<FormCard>child content</FormCard>);
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("does not render title heading when not provided", () => {
    const { container } = render(<FormCard>content</FormCard>);
    expect(container.querySelector("h2")).not.toBeInTheDocument();
  });
});

describe("FormGrid", () => {
  it("renders children", () => {
    render(<FormGrid>grid content</FormGrid>);
    expect(screen.getByText("grid content")).toBeInTheDocument();
  });
});
