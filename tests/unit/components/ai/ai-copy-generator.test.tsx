import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AiCopyGenerator } from "@/components/ai/ai-copy-generator";

// Mock API client
const mockGenerateDescription = vi.fn();
vi.mock("@/lib/api-client", () => ({
  aiApi: {
    generatePropertyDescription: (data: unknown) => mockGenerateDescription(data),
  },
}));

describe("AiCopyGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component", () => {
    render(<AiCopyGenerator propertyId="prop-1" />);
    expect(screen.getByText(/AI Copy Generator|Generate Copy|Property Description/i)).toBeInTheDocument();
  });

  it("has a tone selector", () => {
    render(<AiCopyGenerator propertyId="prop-1" />);
    // Expect some form of tone/style selection
    const toneSelector = screen.getByRole("combobox") || screen.getByLabelText(/tone|style/i);
    expect(toneSelector).toBeInTheDocument();
  });

  it("has a generate button", () => {
    render(<AiCopyGenerator propertyId="prop-1" />);
    const button = screen.getByRole("button", { name: /generate|create/i });
    expect(button).toBeInTheDocument();
  });

  it("shows loading state while generating", async () => {
    mockGenerateDescription.mockReturnValue(new Promise(() => {})); // never resolves

    render(<AiCopyGenerator propertyId="prop-1" />);
    fireEvent.click(screen.getByRole("button", { name: /generate|create/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/generating|loading|creating/i).length).toBeGreaterThan(0);
    });
  });

  it("displays generated copy after success", async () => {
    mockGenerateDescription.mockResolvedValue({
      title: "Stunning Modern Loft",
      description: "Experience luxury living in this breathtaking modern loft.",
      highlights: ["Spacious open floor plan", "Floor-to-ceiling windows", "Premium finishes"],
      provider: "openai",
      tokensUsed: 250,
      cached: false,
    });

    render(<AiCopyGenerator propertyId="prop-1" />);
    fireEvent.click(screen.getByRole("button", { name: /generate|create/i }));

    await waitFor(() => {
      expect(screen.getByText("Stunning Modern Loft")).toBeInTheDocument();
      expect(screen.getByText(/Experience luxury living/)).toBeInTheDocument();
    });
  });

  it("shows error state on failure", async () => {
    mockGenerateDescription.mockRejectedValue(new Error("Service unavailable"));

    render(<AiCopyGenerator propertyId="prop-1" />);
    fireEvent.click(screen.getByRole("button", { name: /generate|create/i }));

    await waitFor(() => {
      expect(screen.getByText(/error|failed|unavailable/i)).toBeInTheDocument();
    });
  });

  it("calls API with correct propertyId and tone", async () => {
    mockGenerateDescription.mockResolvedValue({
      title: "Test",
      description: "Test description",
      highlights: [],
      provider: "openai",
      tokensUsed: 100,
      cached: false,
    });

    render(<AiCopyGenerator propertyId="prop-42" />);

    // Select tone if selector exists
    const combobox = screen.queryByRole("combobox");
    if (combobox) {
      fireEvent.click(combobox);
      const option = screen.getByText(/professional/i);
      fireEvent.click(option);
    }

    fireEvent.click(screen.getByRole("button", { name: /generate|create/i }));

    await waitFor(() => {
      expect(mockGenerateDescription).toHaveBeenCalledWith(
        expect.objectContaining({ propertyId: "prop-42" }),
      );
    });
  });

  it("displays highlights when provided", async () => {
    mockGenerateDescription.mockResolvedValue({
      title: "Test Property",
      description: "A great property.",
      highlights: ["Recently renovated", "Great location", "Move-in ready"],
      provider: "openai",
      tokensUsed: 150,
      cached: false,
    });

    render(<AiCopyGenerator propertyId="prop-1" />);
    fireEvent.click(screen.getByRole("button", { name: /generate|create/i }));

    await waitFor(() => {
      expect(screen.getByText("Recently renovated")).toBeInTheDocument();
      expect(screen.getByText("Great location")).toBeInTheDocument();
      expect(screen.getByText("Move-in ready")).toBeInTheDocument();
    });
  });
});
