import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockMatchLeadProperties = vi.hoisted(() => vi.fn().mockResolvedValue({
  success: true,
  data: {
    matches: [
      {
        propertyId: "prop-1",
        propertyTitle: "Modern Downtown Loft",
        propertyLocation: "Austin, TX",
        score: 92,
        reasons: ["Matches budget ($550k within $500k-$600k range)", "Preferred location: Austin, TX"],
      },
      {
        propertyId: "prop-2",
        propertyTitle: "Suburban Family Home",
        propertyLocation: "Round Rock, TX",
        score: 78,
        reasons: ["Property type match: house", "Within extended budget range"],
      },
    ],
  },
}));

const mockGeneratePropertyDescription = vi.hoisted(() => vi.fn().mockResolvedValue({
  success: true,
  data: {
    title: "Luxury Living in the Heart of Austin",
    description: "Experience unparalleled urban living in this stunning modern loft...",
    highlights: ["Open floor plan", "Floor-to-ceiling windows", "Rooftop terrace"],
    provider: "anthropic",
    tokensUsed: 450,
    cached: false,
  },
}));

const mockGenerateOutreachEmail = vi.hoisted(() => vi.fn().mockResolvedValue({
  success: true,
  data: {
    subject: "Your Perfect Home Awaits in Austin",
    body: "Hi John,\n\nBased on your preferences, I found an amazing property...",
    provider: "anthropic",
    tokensUsed: 320,
    cached: false,
  },
}));

vi.mock("@/lib/api-client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: {} } }),
    post: vi.fn().mockResolvedValue({ success: true, data: [] }),
    interceptors: { request: { use: vi.fn().mockReturnValue(0) }, response: { use: vi.fn().mockReturnValue(0) } },
  },
  setAuthToken: vi.fn(),
  aiApi: {
    matchLeadProperties: mockMatchLeadProperties,
    generatePropertyDescription: mockGeneratePropertyDescription,
    generateOutreachEmail: mockGenerateOutreachEmail,
  },
}));

import React from "react";
import { AiMatchPanel } from "@/components/ai/ai-match-panel";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock AI Copy Generator component
function AiCopyGenerator() {
  const [propertyId, setPropertyId] = React.useState("prop-1");
  const [tone, setTone] = React.useState("luxury");
  const [generated, setGenerated] = React.useState<{
    title: string;
    description: string;
    highlights: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { aiApi } = await import("@/lib/api-client");
      const response = await aiApi.generatePropertyDescription({ propertyId, tone }) as any;
      setGenerated(response.data || response);
    } catch {
      // error handled gracefully
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div data-testid="ai-copy-generator">
      <h3>AI Copy Generator</h3>
      <select
        data-testid="tone-select"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="luxury">Luxury</option>
        <option value="standard">Standard</option>
        <option value="brief">Brief</option>
      </select>
      <button onClick={handleGenerate} data-testid="generate-btn" disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Copy"}
      </button>
      {generated && (
        <div data-testid="generated-copy">
          <h4>{generated.title}</h4>
          <p>{generated.description}</p>
          <ul>
            {generated.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

describe("AI Features: Match Results Display, Copy Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders AI match panel with trigger button", () => {
    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    expect(screen.getByText("AI Match Engine")).toBeInTheDocument();
    expect(screen.getByText("Match Properties")).toBeInTheDocument();
  });

  it("shows loading state when matching is triggered", async () => {
    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    fireEvent.click(screen.getByText("Match Properties"));

    await waitFor(() => {
      expect(screen.getByText("Analyzing matches...")).toBeInTheDocument();
    });
  });

  it("displays match results with scores and reasons", async () => {
    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    await act(async () => {
      fireEvent.click(screen.getByText("Match Properties"));
    });

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
      expect(screen.getByText("92%")).toBeInTheDocument();
      expect(screen.getByText("Austin, TX")).toBeInTheDocument();
      expect(screen.getByText("Matches budget ($550k within $500k-$600k range)")).toBeInTheDocument();
    });
  });

  it("displays multiple match results", async () => {
    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    await act(async () => {
      fireEvent.click(screen.getByText("Match Properties"));
    });

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
      expect(screen.getByText("Suburban Family Home")).toBeInTheDocument();
      expect(screen.getByText("92%")).toBeInTheDocument();
      expect(screen.getByText("78%")).toBeInTheDocument();
    });
  });

  it("shows error state when AI service fails", async () => {
    mockMatchLeadProperties.mockRejectedValueOnce(new Error("AI service unavailable"));

    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    await act(async () => {
      fireEvent.click(screen.getByText("Match Properties"));
    });

    await waitFor(() => {
      expect(screen.getByText("Match failed")).toBeInTheDocument();
      expect(screen.getByText("AI service unavailable. Try again later.")).toBeInTheDocument();
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("shows message when no matches found", async () => {
    mockMatchLeadProperties.mockResolvedValueOnce({
      success: true,
      data: { matches: [] },
    });

    renderWithProviders(<AiMatchPanel leadId="lead-1" />);

    await act(async () => {
      fireEvent.click(screen.getByText("Match Properties"));
    });

    await waitFor(() => {
      expect(screen.getByText("No matching properties found.")).toBeInTheDocument();
    });
  });

  it("renders AI copy generator with tone selector", () => {
    renderWithProviders(<AiCopyGenerator />);

    expect(screen.getByText("AI Copy Generator")).toBeInTheDocument();
    expect(screen.getByTestId("tone-select")).toBeInTheDocument();
    expect(screen.getByTestId("generate-btn")).toBeInTheDocument();
  });

  it("generates marketing copy on button click", async () => {
    renderWithProviders(<AiCopyGenerator />);

    fireEvent.click(screen.getByTestId("generate-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("generated-copy")).toBeInTheDocument();
      expect(screen.getByText("Luxury Living in the Heart of Austin")).toBeInTheDocument();
      expect(screen.getByText("Experience unparalleled urban living in this stunning modern loft...")).toBeInTheDocument();
    });
  });

  it("displays generated highlights", async () => {
    renderWithProviders(<AiCopyGenerator />);

    fireEvent.click(screen.getByTestId("generate-btn"));

    await waitFor(() => {
      expect(screen.getByText("Open floor plan")).toBeInTheDocument();
      expect(screen.getByText("Floor-to-ceiling windows")).toBeInTheDocument();
      expect(screen.getByText("Rooftop terrace")).toBeInTheDocument();
    });
  });

  it("shows loading state during copy generation", async () => {
    mockGeneratePropertyDescription.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({
        success: true,
        data: {
          title: "Test",
          description: "Test desc",
          highlights: [],
          provider: "test",
          tokensUsed: 0,
          cached: false,
        },
      }))
    );

    renderWithProviders(<AiCopyGenerator />);

    fireEvent.click(screen.getByTestId("generate-btn"));

    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  it("handles different tone selections", async () => {
    renderWithProviders(<AiCopyGenerator />);

    fireEvent.change(screen.getByTestId("tone-select"), {
      target: { value: "standard" },
    });

    expect(screen.getByTestId("tone-select")).toHaveValue("standard");
  });

  it("handles AI generation errors gracefully", async () => {
    mockGeneratePropertyDescription.mockRejectedValueOnce(new Error("Generation failed"));

    renderWithProviders(<AiCopyGenerator />);

    fireEvent.click(screen.getByTestId("generate-btn"));

    await waitFor(() => {
      // Should not crash, button should be available again
      expect(screen.getByTestId("generate-btn")).toBeEnabled();
    });
  });
});
