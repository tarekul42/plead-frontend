import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PropertyForm } from "@/components/forms/property-form";

// Mock API client
const mockCreateProperty = vi.fn();
vi.mock("@/lib/api-client", () => ({
  propertiesApi: {
    create: (data: unknown) => mockCreateProperty(data),
  },
}));

const submitButtonName = /create|submit|save|add property/i;

describe("PropertyForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all required fields", () => {
    render(<PropertyForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/baths/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property type/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<PropertyForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: submitButtonName })).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    render(<PropertyForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(
        screen.getByText(/title must be at least 3 characters|title is required/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for short description", async () => {
    render(<PropertyForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Property" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "100000" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/beds/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/baths/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/area/i), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for negative price", async () => {
    render(<PropertyForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Property" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A nice property with enough detail." },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "-100" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/beds/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/baths/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/area/i), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with valid data", async () => {
    const onSubmit = vi.fn();
    render(<PropertyForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Modern Downtown Loft" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A beautiful modern loft in the heart of downtown." },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "550000" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "Austin, TX" },
    });
    fireEvent.change(screen.getByLabelText(/beds/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/baths/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/area/i), {
      target: { value: "1200" },
    });

    // Select property type
    fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: "condo" } });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Modern Downtown Loft",
          price: 550000,
          location: "Austin, TX",
        }),
      );
    });
  });

  it("has a property type selector with options", () => {
    render(<PropertyForm onSubmit={vi.fn()} />);

    const typeSelect = screen.getByLabelText(/property type/i);
    fireEvent.click(typeSelect);

    expect(screen.getByText("House")).toBeInTheDocument();
    expect(screen.getByText("Apartment")).toBeInTheDocument();
    expect(screen.getByText("Condo")).toBeInTheDocument();
    expect(screen.getByText("Townhouse")).toBeInTheDocument();
    expect(screen.getByText("Land")).toBeInTheDocument();
    expect(screen.getByText("Commercial")).toBeInTheDocument();
  });

  it("displays loading state during submission", async () => {
    let resolveSubmit: (value: void | PromiseLike<void>) => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<PropertyForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Property" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A nice property with enough detail." },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "100000" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/beds/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/baths/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/area/i), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: "house" } });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/saving|submitting|creating/i)).toBeInTheDocument();
    });

    resolveSubmit!(undefined);
  });
});
