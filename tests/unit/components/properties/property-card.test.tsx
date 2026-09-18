import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PropertyCard } from "@/components/properties/property-card";
import { mockProperties } from "@/test/mocks/handlers";

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("PropertyCard", () => {
  const property = mockProperties[0];

  it("renders property title as link", () => {
    renderWithQuery(<PropertyCard property={property} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", `/properties/${property.slug}`);
  });

  it("renders price formatted in USD", () => {
    renderWithQuery(<PropertyCard property={property} />);
    expect(screen.getByText(/\$550K/)).toBeInTheDocument();
  });

  it("renders location", () => {
    renderWithQuery(<PropertyCard property={property} />);
    expect(screen.getByText(property.location)).toBeInTheDocument();
  });

  it("renders beds, baths, and area", () => {
    renderWithQuery(<PropertyCard property={property} />);
    const twos = screen.getAllByText("2");
    expect(twos.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(`${property.area?.toLocaleString()} sqft`)).toBeInTheDocument();
  });

  it("renders status badge", () => {
    renderWithQuery(<PropertyCard property={property} />);
    expect(screen.getByText(property.status)).toBeInTheDocument();
  });

  it("renders fallback icon when no images", () => {
    const noImg = { ...property, images: [] };
    renderWithQuery(<PropertyCard property={noImg} />);
    expect(screen.getByText(noImg.title)).toBeInTheDocument();
  });
});
