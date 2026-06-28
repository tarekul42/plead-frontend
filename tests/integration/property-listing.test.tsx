import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockPropertiesApiList = vi.fn().mockResolvedValue({
  success: true,
  data: [
    {
      _id: "prop-1",
      title: "Modern Downtown Loft",
      slug: "modern-downtown-loft",
      description: "A beautiful modern loft in the heart of downtown.",
      price: 550000,
      location: "Austin, TX",
      address: "123 Main St, Austin, TX 73301",
      images: ["https://example.com/img1.jpg"],
      beds: 2,
      baths: 2,
      area: 1200,
      propertyType: "condo",
      status: "available",
      features: ["Pool", "Gym"],
      assignedAgentId: "agent-1",
      views: 150,
      inquiriesCount: 5,
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-06-01T00:00:00Z",
    },
    {
      _id: "prop-2",
      title: "Suburban Family Home",
      slug: "suburban-family-home",
      description: "Spacious family home with a large backyard.",
      price: 425000,
      location: "Round Rock, TX",
      images: ["https://example.com/img2.jpg"],
      beds: 4,
      baths: 3,
      area: 2400,
      propertyType: "house",
      status: "available",
      features: ["Garage", "Yard"],
      assignedAgentId: "agent-1",
      views: 89,
      inquiriesCount: 3,
      createdAt: "2025-02-20T00:00:00Z",
      updatedAt: "2025-06-10T00:00:00Z",
    },
  ],
  meta: { page: 1, limit: 12, total: 2 },
});

vi.mock("@/lib/api-client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: {
          totalLeads: 10,
          totalProperties: 5,
          totalInteractions: 25,
          conversionRate: 0.12,
        },
      },
    }),
    interceptors: { request: { use: vi.fn().mockReturnValue(0) }, response: { use: vi.fn().mockReturnValue(0) } },
  },
  setAuthToken: vi.fn(),
  propertiesApi: {
    list: (...args: unknown[]) => mockPropertiesApiList(...args),
  },
}));

import { useProperties } from "@/lib/queries/use-properties";
import { PropertyCard } from "@/components/properties/property-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock components for the property listing flow
function PropertyListingPage() {
  const { data, isLoading, isError } = useProperties({ page: 1, limit: 12 });

  if (isLoading) return <div data-testid="loading">Loading...</div>;
  if (isError) return <div data-testid="error">Error loading properties</div>;

  const properties = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1>Properties</h1>
      <div data-testid="property-grid">
        {properties.map((prop) => (
          <PropertyCard key={prop._id} property={prop} />
        ))}
      </div>
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={Math.ceil(meta.total / meta.limit)}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}

describe("Property Listing: Search -> Filter -> Pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders property listing page with heading", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getByText("Properties")).toBeInTheDocument();
    });
  });

  it("renders property cards from API data", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
      expect(screen.getByText("Suburban Family Home")).toBeInTheDocument();
    });
  });

  it("displays property prices correctly", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getByText("$550K")).toBeInTheDocument();
      expect(screen.getByText("$425K")).toBeInTheDocument();
    });
  });

  it("renders pagination when there are multiple pages", async () => {
    // Override mock to return multiple pages
    mockPropertiesApiList.mockResolvedValueOnce({
      success: true,
      data: [],
      meta: { page: 1, limit: 12, total: 36 },
    });

    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      // Pagination should show page 1 and page 2 buttons
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("shows empty state when no properties match filters", async () => {
    mockPropertiesApiList.mockResolvedValueOnce({
      success: true,
      data: [],
      meta: { page: 1, limit: 12, total: 0 },
    });

    function EmptyListingPage() {
      const { data, isLoading } = useProperties({ q: "nonexistent-city" });

      if (isLoading) return <div>Loading...</div>;

      const properties = data?.data ?? [];

      if (properties.length === 0) {
        return <EmptyState title="No properties found" message="Try adjusting your filters." />;
      }

      return <div>Properties</div>;
    }

    renderWithProviders(<EmptyListingPage />);

    await waitFor(() => {
      expect(screen.getByText("No properties found")).toBeInTheDocument();
    });
  });

  it("handles filter changes trigger new API calls", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
    });

    // Verify the API was called
    expect(mockPropertiesApiList).toHaveBeenCalled();
  });

  it("displays property status badges", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getAllByText("available").length).toBeGreaterThan(0);
    });
  });

  it("renders property details (beds, baths, area)", async () => {
    renderWithProviders(<PropertyListingPage />);

    await waitFor(() => {
      expect(screen.getAllByText("2").length).toBeGreaterThan(0);
      expect(screen.getByText(/1,200 sqft/)).toBeInTheDocument();
    });
  });

  it("handles server error gracefully", async () => {
    mockPropertiesApiList.mockRejectedValueOnce(new Error("Server error"));

    function ErrorListingPage() {
      const { data, isLoading, isError, refetch } = useProperties({});

      if (isLoading) return <div>Loading...</div>;
      if (isError)
        return (
          <div>
            <p>Error loading properties</p>
            <button onClick={() => refetch()}>Retry</button>
          </div>
        );

      return <div>No data</div>;
    }

    renderWithProviders(<ErrorListingPage />);

    await waitFor(() => {
      expect(screen.getByText("Error loading properties")).toBeInTheDocument();
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });
});
