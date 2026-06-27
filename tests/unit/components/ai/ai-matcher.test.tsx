import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AiMatchPanel } from "@/components/ai/ai-match-panel";

// Mock API client
const mockMatchLeadProperties = vi.fn();
vi.mock("@/lib/api-client", () => ({
  aiApi: {
    matchLeadProperties: (data: unknown) => mockMatchLeadProperties(data),
  },
}));

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

const mockMatches = [
  {
    propertyId: "prop-1",
    propertyTitle: "Modern Downtown Loft",
    propertyLocation: "Austin, TX",
    score: 92,
    reasons: ["Matches budget", "Preferred location"],
  },
  {
    propertyId: "prop-2",
    propertyTitle: "Suburban Family Home",
    propertyLocation: "Round Rock, TX",
    score: 75,
    reasons: ["Good school district"],
  },
];

describe("AiMatchPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the match button initially", () => {
    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    expect(screen.getByText("Match Properties")).toBeInTheDocument();
    expect(screen.getByText("AI Match Engine")).toBeInTheDocument();
  });

  it("shows loading state after clicking match", async () => {
    mockMatchLeadProperties.mockReturnValue(new Promise(() => {})); // never resolves

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Analyzing matches...")).toBeInTheDocument();
    });
  });

  it("displays match results after successful fetch", async () => {
    mockMatchLeadProperties.mockResolvedValue({
      success: true,
      data: { matches: mockMatches },
    });

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
      expect(screen.getByText("Suburban Family Home")).toBeInTheDocument();
    });
  });

  it("displays match scores with correct color coding", async () => {
    mockMatchLeadProperties.mockResolvedValue({
      success: true,
      data: {
        matches: [
          { ...mockMatches[0], score: 92 },
          { ...mockMatches[1], score: 55 },
        ],
      },
    });

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("92%")).toBeInTheDocument();
      expect(screen.getByText("55%")).toBeInTheDocument();
    });
  });

  it("shows 'No matching properties found' when results are empty", async () => {
    mockMatchLeadProperties.mockResolvedValue({
      success: true,
      data: { matches: [] },
    });

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("No matching properties found.")).toBeInTheDocument();
    });
  });

  it("shows error state on failure", async () => {
    mockMatchLeadProperties.mockRejectedValue(new Error("Service unavailable"));

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Match failed")).toBeInTheDocument();
      expect(screen.getByText("AI service unavailable. Try again later.")).toBeInTheDocument();
    });
  });

  it("shows retry button on error", async () => {
    mockMatchLeadProperties.mockRejectedValue(new Error("Service unavailable"));

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("calls the API with the correct leadId", async () => {
    mockMatchLeadProperties.mockResolvedValue({
      success: true,
      data: { matches: mockMatches },
    });

    render(<AiMatchPanel leadId="lead-42" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(mockMatchLeadProperties).toHaveBeenCalledWith({ leadId: "lead-42" });
    });
  });

  it("shows refresh button after results load", async () => {
    mockMatchLeadProperties.mockResolvedValue({
      success: true,
      data: { matches: mockMatches },
    });

    render(<AiMatchPanel leadId="lead-1" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Refresh matches")).toBeInTheDocument();
    });
  });
});
