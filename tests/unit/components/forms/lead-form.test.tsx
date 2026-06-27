import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeadForm } from "@/components/forms/lead-form";

const submitButtonName = /create|submit|save|add lead/i;

describe("LeadForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all required fields", () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned agent/i)).toBeInTheDocument();
  });

  it("renders optional fields", () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<LeadForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: submitButtonName })).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for negative budget", async () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: "-100" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/budget must be positive/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with valid data", async () => {
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "+1-555-0101" },
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: "500000" },
    });
    fireEvent.change(screen.getByLabelText(/preferred location/i), {
      target: { value: "Austin, TX" },
    });
    fireEvent.change(screen.getByLabelText(/assigned agent/i), {
      target: { value: "agent-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          budget: 500000,
        }),
      );
    });
  });

  it("submits with only required fields", async () => {
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/assigned agent/i), {
      target: { value: "agent-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Jane Doe",
          email: "jane@example.com",
        }),
      );
    });
  });

  it("displays loading state during submission", async () => {
    let resolveSubmit: (value: void | PromiseLike<void>) => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<LeadForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Lead" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/assigned agent/i), {
      target: { value: "agent-1" },
    });

    fireEvent.click(screen.getByRole("button", { name: submitButtonName }));

    await waitFor(() => {
      expect(screen.getByText(/saving|submitting|creating/i)).toBeInTheDocument();
    });

    resolveSubmit!(undefined);
  });

  it("has a status selector", () => {
    render(<LeadForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("has a source selector", () => {
    render(<LeadForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
  });
});
