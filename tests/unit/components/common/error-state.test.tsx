import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "@/components/common/error-state";

describe("ErrorState", () => {
  it("renders default message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<ErrorState message="Failed to load properties" />);
    expect(screen.getByText("Failed to load properties")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render retry button without onRetry", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
